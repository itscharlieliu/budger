import { Router } from "express";
import { Request, Response } from "express";
import { db } from "@/config/database";
import { logger } from "@/utils/logger";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

class ExportController {
  /**
   * Export transactions to CSV
   */
  static async exportTransactions(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const { start_date, end_date, account_id, format = "csv" } = req.query;

      let query = db("transactions")
        .leftJoin(
          "budget_categories",
          "transactions.budget_category_id",
          "budget_categories.id"
        )
        .leftJoin(
          "budget_groups",
          "budget_categories.budget_group_id",
          "budget_groups.id"
        )
        .leftJoin("accounts", "transactions.account_id", "accounts.id")
        .where("transactions.user_id", req.user.id)
        .select(
          "transactions.date",
          "transactions.payee",
          "transactions.description",
          "transactions.amount",
          "transactions.notes",
          "accounts.name as account_name",
          "budget_categories.name as category_name",
          "budget_groups.name as group_name"
        );

      if (start_date) {
        query = query.where("transactions.date", ">=", start_date);
      }

      if (end_date) {
        query = query.where("transactions.date", "<=", end_date);
      }

      if (account_id) {
        query = query.where("transactions.account_id", account_id);
      }

      const transactions = await query.orderBy("transactions.date", "desc");

      if (format === "csv") {
        // Generate CSV
        const csvHeader =
          "Date,Payee,Description,Amount,Account,Category,Group,Notes\n";
        const csvRows = transactions.map((t) => {
          const row = [
            t.date,
            `"${t.payee}"`,
            `"${t.description || ""}"`,
            t.amount,
            `"${t.account_name}"`,
            `"${t.category_name || ""}"`,
            `"${t.group_name || ""}"`,
            `"${t.notes || ""}"`,
          ];
          return row.join(",");
        });

        const csvContent = csvHeader + csvRows.join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="transactions-${
            new Date().toISOString().split("T")[0]
          }.csv"`
        );
        res.send(csvContent);
      } else {
        // Return JSON
        res.json({
          success: true,
          data: transactions,
        });
      }
    } catch (error) {
      logger.error("Export transactions error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to export transactions",
      });
    }
  }

  /**
   * Export budget data
   */
  static async exportBudget(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const { month_code } = req.query;

      let query = db("monthly_budgets")
        .leftJoin(
          "budget_categories",
          "monthly_budgets.budget_category_id",
          "budget_categories.id"
        )
        .leftJoin(
          "budget_groups",
          "budget_categories.budget_group_id",
          "budget_groups.id"
        )
        .where("monthly_budgets.user_id", req.user.id)
        .select(
          "monthly_budgets.month_code",
          "monthly_budgets.budgeted_amount",
          "monthly_budgets.activity_amount",
          "budget_categories.name as category_name",
          "budget_groups.name as group_name"
        );

      if (month_code) {
        query = query.where("monthly_budgets.month_code", month_code);
      }

      const budgets = await query
        .orderBy("budget_groups.sort_order")
        .orderBy("budget_categories.sort_order");

      res.json({
        success: true,
        data: budgets,
      });
    } catch (error) {
      logger.error("Export budget error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to export budget",
      });
    }
  }
}

// Routes
router.use(authenticateToken);

router.get("/transactions", ExportController.exportTransactions);
router.get("/budget", ExportController.exportBudget);

export default router;
