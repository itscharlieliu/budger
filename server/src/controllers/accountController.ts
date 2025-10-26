import { Request, Response } from "express";
import Joi from "joi";
import { db } from "@/config/database";
import { logger } from "@/utils/logger";
import { AccountType, CreateAccountRequest } from "@/types";

// Validation schemas
const createAccountSchema = Joi.object({
  name: Joi.string().min(1).required(),
  type: Joi.string().valid("budgeted", "unbudgeted").required(),
  cached_balance: Joi.number().default(0),
});

const updateAccountSchema = Joi.object({
  name: Joi.string().min(1),
  type: Joi.string().valid("budgeted", "unbudgeted"),
  cached_balance: Joi.number(),
});

export class AccountController {
  /**
   * Get all accounts for the authenticated user
   */
  static async getAccounts(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const accounts = await db("accounts")
        .where("user_id", req.user.id)
        .where("is_active", true)
        .orderBy("name");

      res.json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      logger.error("Get accounts error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get accounts",
      });
    }
  }

  /**
   * Get a specific account
   */
  static async getAccount(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { id } = req.params;

      const account = await db("accounts")
        .where("id", id)
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

      res.json({
        success: true,
        data: account,
      });
    } catch (error) {
      logger.error("Get account error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get account",
      });
    }
  }

  /**
   * Create a new account
   */
  static async createAccount(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { error, value } = createAccountSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const { name, type, cached_balance }: CreateAccountRequest = value;

      // Check if account name already exists for this user
      const existingAccount = await db("accounts")
        .where("user_id", req.user.id)
        .where("name", name)
        .where("is_active", true)
        .first();

      if (existingAccount) {
        res.status(409).json({
          success: false,
          error: "Account with this name already exists",
        });
        return;
      }

      const [account] = await db("accounts")
        .insert({
          user_id: req.user.id,
          name,
          type,
          cached_balance: cached_balance || 0,
        })
        .returning("*");

      logger.info(`Account created: ${name} for user ${req.user.id}`);
      res.status(201).json({
        success: true,
        data: account,
      });
    } catch (error) {
      logger.error("Create account error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create account",
      });
    }
  }

  /**
   * Update an account
   */
  static async updateAccount(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { id } = req.params;
      const { error, value } = updateAccountSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      // Check if account exists and belongs to user
      const existingAccount = await db("accounts")
        .where("id", id)
        .where("user_id", req.user.id)
        .where("is_active", true)
        .first();

      if (!existingAccount) {
        res.status(404).json({
          success: false,
          error: "Account not found",
        });
        return;
      }

      // Check if new name conflicts with existing accounts
      if (value.name && value.name !== existingAccount.name) {
        const nameConflict = await db("accounts")
          .where("user_id", req.user.id)
          .where("name", value.name)
          .where("id", "!=", id)
          .where("is_active", true)
          .first();

        if (nameConflict) {
          res.status(409).json({
            success: false,
            error: "Account with this name already exists",
          });
          return;
        }
      }

      const [updatedAccount] = await db("accounts")
        .where("id", id)
        .where("user_id", req.user.id)
        .update({
          ...value,
          updated_at: new Date(),
        })
        .returning("*");

      res.json({
        success: true,
        data: updatedAccount,
      });
    } catch (error) {
      logger.error("Update account error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update account",
      });
    }
  }

  /**
   * Delete an account (soft delete)
   */
  static async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { id } = req.params;

      // Check if account exists and belongs to user
      const account = await db("accounts")
        .where("id", id)
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

      // Check if account has transactions
      const transactionCount = await db("transactions")
        .where("account_id", id)
        .count("* as count")
        .first();

      if (parseInt(transactionCount?.count as string) > 0) {
        res.status(400).json({
          success: false,
          error: "Cannot delete account with existing transactions",
        });
        return;
      }

      await db("accounts")
        .where("id", id)
        .where("user_id", req.user.id)
        .update({
          is_active: false,
          updated_at: new Date(),
        });

      logger.info(`Account deleted: ${account.name} for user ${req.user.id}`);
      res.json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      logger.error("Delete account error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete account",
      });
    }
  }

  /**
   * Update account balance
   */
  static async updateBalance(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { id } = req.params;
      const { cached_balance } = req.body;

      if (typeof cached_balance !== "number") {
        res.status(400).json({
          success: false,
          error: "Invalid balance value",
        });
        return;
      }

      const [updatedAccount] = await db("accounts")
        .where("id", id)
        .where("user_id", req.user.id)
        .update({
          cached_balance,
          updated_at: new Date(),
        })
        .returning("*");

      if (!updatedAccount) {
        res.status(404).json({
          success: false,
          error: "Account not found",
        });
        return;
      }

      res.json({
        success: true,
        data: updatedAccount,
      });
    } catch (error) {
      logger.error("Update balance error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update balance",
      });
    }
  }
}
