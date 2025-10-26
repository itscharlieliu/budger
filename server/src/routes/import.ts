import { Router } from "express";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import { Request, Response } from "express";
import Joi from "joi";
import { db } from "@/config/database";
import { logger } from "@/utils/logger";
import { authenticateToken } from "@/middleware/auth";
import { CategorizationService } from "@/services/categorization";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

// Validation schemas
const importSchema = Joi.object({
  account_id: Joi.string().uuid().required(),
  date_format: Joi.string().default("YYYY-MM-DD"),
  has_header: Joi.boolean().default(true),
  columns: Joi.object({
    date: Joi.string().required(),
    payee: Joi.string().required(),
    amount: Joi.string().required(),
    account: Joi.string().optional(),
    category: Joi.string().optional(),
    notes: Joi.string().optional(),
  }).required(),
});

class ImportController {
  /**
   * Upload and process CSV file
   */
  static async importCSV(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const { error, value } = importSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const { account_id, date_format, has_header, columns } = value;

      // Verify account belongs to user
      const account = await db("accounts")
        .where("id", account_id)
        .where("user_id", req.user.id)
        .where("is_active", true)
        .first();

      if (!account) {
        res.status(404).json({
          success: false,
          error: "Account not found",
        });
        return;
      }

      // Create import job
      const [importJob] = await db("import_jobs")
        .insert({
          user_id: req.user.id,
          filename: req.file?.originalname || "unknown.csv",
          status: "processing",
          started_at: new Date(),
        })
        .returning("*");

      // Process CSV in background
      setImmediate(() => {
        ImportController.processCSVFile(
          req.file!.buffer,
          req.user!.id,
          account_id,
          columns,
          date_format,
          has_header,
          importJob.id
        );
      });

      res.status(202).json({
        success: true,
        data: { import_job_id: importJob.id },
        message: "CSV import started",
      });
    } catch (error) {
      logger.error("Import CSV error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to start CSV import",
      });
    }
  }

  /**
   * Process CSV file data
   */
  private static async processCSVFile(
    buffer: Buffer,
    userId: string,
    accountId: string,
    columns: any,
    dateFormat: string,
    hasHeader: boolean,
    importJobId: string
  ): Promise<void> {
    try {
      const csvData: any[] = [];
      const stream = Readable.from(buffer.toString());

      await new Promise((resolve, reject) => {
        stream
          .pipe(csv({ headers: hasHeader }))
          .on("data", (row) => csvData.push(row))
          .on("end", resolve)
          .on("error", reject);
      });

      let processedRows = 0;
      let successfulRows = 0;
      let failedRows = 0;
      const errors: any[] = [];

      // Get available categories for deduplication
      const categories = await db("budget_categories")
        .where("user_id", userId)
        .where("is_active", true)
        .select("id", "name");

      const categoryMap = new Map(
        categories.map((c) => [c.name.toLowerCase(), c.id])
      );

      for (const row of csvData) {
        try {
          processedRows++;

          // Parse transaction data
          const transactionData = ImportController.parseTransactionRow(
            row,
            columns,
            dateFormat
          );

          // Check for duplicates
          const duplicate = await db("transactions")
            .where("user_id", userId)
            .where("account_id", accountId)
            .where("payee", transactionData.payee)
            .where("amount", transactionData.amount)
            .where("date", transactionData.date)
            .first();

          if (duplicate) {
            logger.info(
              `Skipping duplicate transaction: ${transactionData.payee}`
            );
            continue;
          }

          // Find category if provided
          let budgetCategoryId = null;
          if (transactionData.category) {
            const categoryId = categoryMap.get(
              transactionData.category.toLowerCase()
            );
            if (categoryId) {
              budgetCategoryId = categoryId;
            }
          }

          // Create transaction
          await db("transactions").insert({
            user_id: userId,
            account_id: accountId,
            budget_category_id: budgetCategoryId,
            external_id: `csv_${importJobId}_${processedRows}`,
            payee: transactionData.payee,
            description: transactionData.description,
            amount: transactionData.amount,
            date: transactionData.date,
            notes: transactionData.notes,
          });

          successfulRows++;
        } catch (rowError) {
          failedRows++;
          errors.push({
            row: processedRows,
            error:
              rowError instanceof Error ? rowError.message : "Unknown error",
            data: row,
          });
        }
      }

      // Update import job
      await db("import_jobs")
        .where("id", importJobId)
        .update({
          status: "completed",
          total_rows: csvData.length,
          processed_rows: processedRows,
          successful_rows: successfulRows,
          failed_rows: failedRows,
          errors: errors.length > 0 ? errors : null,
          completed_at: new Date(),
          updated_at: new Date(),
        });

      logger.info(
        `CSV import completed: ${successfulRows} successful, ${failedRows} failed for user ${userId}`
      );
    } catch (error) {
      logger.error("CSV processing error:", error);

      // Update import job with error
      await db("import_jobs")
        .where("id", importJobId)
        .update({
          status: "failed",
          errors: [
            { error: error instanceof Error ? error.message : "Unknown error" },
          ],
          completed_at: new Date(),
          updated_at: new Date(),
        });
    }
  }

  /**
   * Parse a single transaction row
   */
  private static parseTransactionRow(
    row: any,
    columns: any,
    dateFormat: string
  ): {
    payee: string;
    description?: string;
    amount: number;
    date: Date;
    category?: string;
    notes?: string;
  } {
    const payee = row[columns.payee]?.trim();
    if (!payee) {
      throw new Error("Payee is required");
    }

    const amountStr = row[columns.amount]?.trim();
    if (!amountStr) {
      throw new Error("Amount is required");
    }

    // Parse amount (remove currency symbols and commas)
    const amount = parseFloat(amountStr.replace(/[$,]/g, ""));
    if (isNaN(amount)) {
      throw new Error("Invalid amount format");
    }

    const dateStr = row[columns.date]?.trim();
    if (!dateStr) {
      throw new Error("Date is required");
    }

    // Parse date based on format
    let date: Date;
    if (dateFormat === "YYYY-MM-DD") {
      date = new Date(dateStr);
    } else if (dateFormat === "MM/DD/YYYY") {
      const [month, day, year] = dateStr.split("/");
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (dateFormat === "DD/MM/YYYY") {
      const [day, month, year] = dateStr.split("/");
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    return {
      payee,
      description: row[columns.description]?.trim(),
      amount,
      date,
      category: row[columns.category]?.trim(),
      notes: row[columns.notes]?.trim(),
    };
  }

  /**
   * Get import job status
   */
  static async getImportStatus(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const { job_id } = req.params;

      const importJob = await db("import_jobs")
        .where("id", job_id)
        .where("user_id", req.user.id)
        .first();

      if (!importJob) {
        res.status(404).json({
          success: false,
          error: "Import job not found",
        });
        return;
      }

      res.json({
        success: true,
        data: importJob,
      });
    } catch (error) {
      logger.error("Get import status error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get import status",
      });
    }
  }

  /**
   * Get all import jobs for user
   */
  static async getImportJobs(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const jobs = await db("import_jobs")
        .where("user_id", req.user.id)
        .orderBy("created_at", "desc")
        .limit(20);

      res.json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      logger.error("Get import jobs error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get import jobs",
      });
    }
  }
}

// Routes
router.use(authenticateToken);

router.post("/csv", upload.single("file"), ImportController.importCSV);
router.get("/jobs/:job_id", ImportController.getImportStatus);
router.get("/jobs", ImportController.getImportJobs);

export default router;
