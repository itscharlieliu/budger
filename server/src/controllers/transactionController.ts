import { Request, Response } from "express";
import Joi from "joi";
import { db } from "@/config/database";
import { logger } from "@/utils/logger";
import { CategorizationService } from "@/services/categorization";
import { CreateTransactionRequest, UpdateTransactionRequest } from "@/types";

// Validation schemas
const createTransactionSchema = Joi.object({
  account_id: Joi.string().uuid().required(),
  budget_category_id: Joi.string().uuid().optional(),
  payee: Joi.string().min(1).required(),
  description: Joi.string().optional(),
  amount: Joi.number().required(),
  date: Joi.date().required(),
  notes: Joi.string().optional(),
});

const updateTransactionSchema = Joi.object({
  budget_category_id: Joi.string().uuid().optional(),
  payee: Joi.string().min(1).optional(),
  description: Joi.string().optional(),
  amount: Joi.number().optional(),
  date: Joi.date().optional(),
  notes: Joi.string().optional(),
});

const getTransactionsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  account_id: Joi.string().uuid().optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
  category: Joi.string().optional(),
  search: Joi.string().optional(),
});

export class TransactionController {
  /**
   * Get transactions with pagination and filtering
   */
  static async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { error, value } = getTransactionsSchema.validate(req.query);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const {
        page,
        limit,
        account_id,
        start_date,
        end_date,
        category,
        search,
      } = value;
      const offset = (page - 1) * limit;

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
          "transactions.*",
          "budget_categories.name as category_name",
          "budget_groups.name as group_name",
          "accounts.name as account_name"
        );

      // Apply filters
      if (account_id) {
        query = query.where("transactions.account_id", account_id);
      }

      if (start_date) {
        query = query.where("transactions.date", ">=", start_date);
      }

      if (end_date) {
        query = query.where("transactions.date", "<=", end_date);
      }

      if (category) {
        query = query.where("budget_categories.name", "ilike", `%${category}%`);
      }

      if (search) {
        query = query.where(function () {
          this.where("transactions.payee", "ilike", `%${search}%`)
            .orWhere("transactions.description", "ilike", `%${search}%`)
            .orWhere("transactions.notes", "ilike", `%${search}%`);
        });
      }

      // Get total count
      const countQuery = query.clone();
      const [{ count }] = await countQuery.count("* as count");

      // Get paginated results
      const transactions = await query
        .orderBy("transactions.date", "desc")
        .orderBy("transactions.created_at", "desc")
        .limit(limit)
        .offset(offset);

      res.json({
        success: true,
        data: transactions,
        pagination: {
          page,
          limit,
          total: parseInt(count as string),
          total_pages: Math.ceil(parseInt(count as string) / limit),
        },
      });
    } catch (error) {
      logger.error("Get transactions error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get transactions",
      });
    }
  }

  /**
   * Get a specific transaction
   */
  static async getTransaction(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { id } = req.params;

      const transaction = await db("transactions")
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
        .where("transactions.id", id)
        .where("transactions.user_id", req.user.id)
        .select(
          "transactions.*",
          "budget_categories.name as category_name",
          "budget_groups.name as group_name",
          "accounts.name as account_name"
        )
        .first();

      if (!transaction) {
        res.status(404).json({
          success: false,
          error: "Transaction not found",
        });
        return;
      }

      res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      logger.error("Get transaction error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get transaction",
      });
    }
  }

  /**
   * Create a new transaction
   */
  static async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { error, value } = createTransactionSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const {
        account_id,
        budget_category_id,
        payee,
        description,
        amount,
        date,
        notes,
      }: CreateTransactionRequest = value;

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

      // Verify category belongs to user if provided
      if (budget_category_id) {
        const category = await db("budget_categories")
          .where("id", budget_category_id)
          .where("user_id", req.user.id)
          .where("is_active", true)
          .first();

        if (!category) {
          res.status(404).json({
            success: false,
            error: "Budget category not found",
          });
          return;
        }
      }

      const [transaction] = await db("transactions")
        .insert({
          user_id: req.user.id,
          account_id,
          budget_category_id,
          payee,
          description,
          amount,
          date,
          notes,
        })
        .returning("*");

      logger.info(`Transaction created: ${payee} for user ${req.user.id}`);
      res.status(201).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      logger.error("Create transaction error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create transaction",
      });
    }
  }

  /**
   * Update a transaction
   */
  static async updateTransaction(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { id } = req.params;
      const { error, value } = updateTransactionSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      // Check if transaction exists and belongs to user
      const existingTransaction = await db("transactions")
        .where("id", id)
        .where("user_id", req.user.id)
        .first();

      if (!existingTransaction) {
        res.status(404).json({
          success: false,
          error: "Transaction not found",
        });
        return;
      }

      // Verify category belongs to user if provided
      if (value.budget_category_id) {
        const category = await db("budget_categories")
          .where("id", value.budget_category_id)
          .where("user_id", req.user.id)
          .where("is_active", true)
          .first();

        if (!category) {
          res.status(404).json({
            success: false,
            error: "Budget category not found",
          });
          return;
        }
      }

      const [updatedTransaction] = await db("transactions")
        .where("id", id)
        .where("user_id", req.user.id)
        .update({
          ...value,
          updated_at: new Date(),
        })
        .returning("*");

      res.json({
        success: true,
        data: updatedTransaction,
      });
    } catch (error) {
      logger.error("Update transaction error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update transaction",
      });
    }
  }

  /**
   * Delete a transaction
   */
  static async deleteTransaction(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { id } = req.params;

      const transaction = await db("transactions")
        .where("id", id)
        .where("user_id", req.user.id)
        .first();

      if (!transaction) {
        res.status(404).json({
          success: false,
          error: "Transaction not found",
        });
        return;
      }

      await db("transactions")
        .where("id", id)
        .where("user_id", req.user.id)
        .del();

      logger.info(
        `Transaction deleted: ${transaction.payee} for user ${req.user.id}`
      );
      res.json({
        success: true,
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      logger.error("Delete transaction error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete transaction",
      });
    }
  }

  /**
   * Categorize transactions using AI
   */
  static async categorizeTransactions(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { transaction_ids } = req.body;

      if (!Array.isArray(transaction_ids) || transaction_ids.length === 0) {
        res.status(400).json({
          success: false,
          error: "Transaction IDs array is required",
        });
        return;
      }

      // Get uncategorized transactions
      const transactions = await db("transactions")
        .where("user_id", req.user.id)
        .whereIn("id", transaction_ids)
        .whereNull("budget_category_id")
        .select("id", "payee", "description", "amount");

      if (transactions.length === 0) {
        res.status(404).json({
          success: false,
          error: "No uncategorized transactions found",
        });
        return;
      }

      // Get available categories
      const categories = await db("budget_categories")
        .where("user_id", req.user.id)
        .where("is_active", true)
        .select("name");

      const categoryNames = categories.map((c) => c.name);

      // Categorize transactions
      const categorizationResults =
        await CategorizationService.categorizeTransactions(
          transactions.map((t) => ({
            payee: t.payee,
            description: t.description || "",
            amount: t.amount,
          })),
          categoryNames
        );

      // Update transactions with categories
      const updates = [];
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        const result = categorizationResults[i];

        if (result.confidence > 50) {
          // Only apply if confidence > 50%
          const category = categories.find((c) => c.name === result.category);
          if (category) {
            updates.push({
              id: transaction.id,
              budget_category_id: category.id,
              categorized_at: new Date(),
            });
          }
        }
      }

      // Batch update transactions
      if (updates.length > 0) {
        await db.transaction(async (trx) => {
          for (const update of updates) {
            await trx("transactions").where("id", update.id).update({
              budget_category_id: update.budget_category_id,
              categorized_at: update.categorized_at,
              updated_at: new Date(),
            });
          }
        });
      }

      res.json({
        success: true,
        data: {
          processed: transactions.length,
          categorized: updates.length,
          results: categorizationResults,
        },
      });
    } catch (error) {
      logger.error("Categorize transactions error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to categorize transactions",
      });
    }
  }
}
