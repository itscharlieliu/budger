import { Request, Response } from "express";
import Joi from "joi";
import { db } from "@/config/database";
import { logger } from "@/utils/logger";
import { PlaidService } from "@/services/plaid";
import { CategorizationService } from "@/services/categorization";

// Validation schemas
const exchangeTokenSchema = Joi.object({
  public_token: Joi.string().required(),
  institution_id: Joi.string().required(),
  institution_name: Joi.string().required(),
});

export class PlaidController {
  /**
   * Create a link token for Plaid Link
   */
  static async createLinkToken(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const linkToken = await PlaidService.createLinkToken(req.user.id);

      res.json({
        success: true,
        data: { link_token: linkToken },
      });
    } catch (error) {
      logger.error("Create link token error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create link token",
      });
    }
  }

  /**
   * Exchange public token for access token and sync accounts
   */
  static async exchangeToken(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { error, value } = exchangeTokenSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const { public_token, institution_id, institution_name } = value;

      // Exchange public token for access token
      const { access_token, item_id } = await PlaidService.exchangePublicToken(
        public_token
      );

      // Get institution information
      const institution = await PlaidService.getInstitution(institution_id);

      // Store Plaid item
      const [plaidItem] = await db("plaid_items")
        .insert({
          user_id: req.user.id,
          item_id,
          access_token, // In production, encrypt this
          institution_id,
          institution_name,
          available_products: institution.products,
        })
        .returning("*");

      // Get accounts from Plaid
      const plaidAccounts = await PlaidService.getAccounts(access_token);

      // Create accounts in our database
      const accounts = [];
      for (const plaidAccount of plaidAccounts) {
        const [account] = await db("accounts")
          .insert({
            user_id: req.user.id,
            plaid_item_id: plaidItem.id,
            plaid_account_id: plaidAccount.account_id,
            name: plaidAccount.name,
            type: "budgeted", // Default to budgeted
            cached_balance: plaidAccount.balances.current || 0,
            official_name: plaidAccount.official_name,
            mask: plaidAccount.mask,
            subtype: plaidAccount.subtype,
          })
          .returning("*");

        accounts.push(account);
      }

      logger.info(
        `Plaid item connected: ${institution_name} for user ${req.user.id}`
      );
      res.json({
        success: true,
        data: {
          plaid_item: plaidItem,
          accounts,
        },
      });
    } catch (error) {
      logger.error("Exchange token error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to exchange token",
      });
    }
  }

  /**
   * Sync transactions from Plaid
   */
  static async syncTransactions(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { item_id } = req.params;

      // Get Plaid item
      const plaidItem = await db("plaid_items")
        .where("id", item_id)
        .where("user_id", req.user.id)
        .first();

      if (!plaidItem) {
        res.status(404).json({
          success: false,
          error: "Plaid item not found",
        });
        return;
      }

      // Get date range (last 30 days by default)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      // Get transactions from Plaid
      const plaidTransactions = await PlaidService.getTransactions(
        plaidItem.access_token,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );

      // Get user's accounts
      const accounts = await db("accounts")
        .where("plaid_item_id", plaidItem.id)
        .where("user_id", req.user.id);

      const accountMap = new Map(
        accounts.map((acc) => [acc.plaid_account_id, acc.id])
      );

      // Process transactions
      let newTransactions = 0;
      let updatedTransactions = 0;

      for (const plaidTransaction of plaidTransactions) {
        const accountId = accountMap.get(plaidTransaction.account_id);
        if (!accountId) continue;

        // Check if transaction already exists
        const existingTransaction = await db("transactions")
          .where("plaid_transaction_id", plaidTransaction.transaction_id)
          .where("user_id", req.user.id)
          .first();

        const transactionData = {
          user_id: req.user.id,
          account_id: accountId,
          plaid_transaction_id: plaidTransaction.transaction_id,
          payee: plaidTransaction.merchant_name || plaidTransaction.name,
          description: plaidTransaction.name,
          amount: -plaidTransaction.amount, // Plaid amounts are positive for debits
          date: plaidTransaction.date,
          category_primary: plaidTransaction.category?.[0],
          category_detailed: plaidTransaction.category?.join(" > "),
          is_pending: plaidTransaction.pending,
        };

        if (existingTransaction) {
          // Update existing transaction
          await db("transactions")
            .where("id", existingTransaction.id)
            .update({
              ...transactionData,
              updated_at: new Date(),
            });
          updatedTransactions++;
        } else {
          // Create new transaction
          await db("transactions").insert(transactionData);
          newTransactions++;
        }
      }

      // Update Plaid item status
      await db("plaid_items").where("id", plaidItem.id).update({
        last_successful_update: new Date(),
        error_code: null,
        error_message: null,
        updated_at: new Date(),
      });

      logger.info(
        `Synced transactions: ${newTransactions} new, ${updatedTransactions} updated for user ${req.user.id}`
      );
      res.json({
        success: true,
        data: {
          new_transactions: newTransactions,
          updated_transactions: updatedTransactions,
          total_processed: plaidTransactions.length,
        },
      });
    } catch (error) {
      logger.error("Sync transactions error:", error);

      // Update Plaid item with error
      const { item_id } = req.params;
      await db("plaid_items")
        .where("id", item_id)
        .where("user_id", req.user!.id)
        .update({
          last_failed_update: new Date(),
          error_code: "SYNC_ERROR",
          error_message:
            error instanceof Error ? error.message : "Unknown error",
          updated_at: new Date(),
        });

      res.status(500).json({
        success: false,
        error: "Failed to sync transactions",
      });
    }
  }

  /**
   * Get Plaid items for user
   */
  static async getItems(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const items = await db("plaid_items")
        .where("user_id", req.user.id)
        .orderBy("created_at", "desc");

      res.json({
        success: true,
        data: items,
      });
    } catch (error) {
      logger.error("Get Plaid items error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get Plaid items",
      });
    }
  }

  /**
   * Remove a Plaid item
   */
  static async removeItem(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { item_id } = req.params;

      const plaidItem = await db("plaid_items")
        .where("id", item_id)
        .where("user_id", req.user.id)
        .first();

      if (!plaidItem) {
        res.status(404).json({
          success: false,
          error: "Plaid item not found",
        });
        return;
      }

      // Remove from Plaid
      await PlaidService.removeItem(plaidItem.access_token);

      // Remove from database (cascade will handle accounts)
      await db("plaid_items")
        .where("id", item_id)
        .where("user_id", req.user.id)
        .del();

      logger.info(
        `Plaid item removed: ${plaidItem.institution_name} for user ${req.user.id}`
      );
      res.json({
        success: true,
        message: "Plaid item removed successfully",
      });
    } catch (error) {
      logger.error("Remove Plaid item error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to remove Plaid item",
      });
    }
  }

  /**
   * Handle Plaid webhooks
   */
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { webhook_type, webhook_code, item_id } = req.body;

      logger.info(
        `Plaid webhook received: ${webhook_type} - ${webhook_code} for item ${item_id}`
      );

      // Handle different webhook types
      switch (webhook_type) {
        case "TRANSACTIONS":
          if (
            webhook_code === "INITIAL_UPDATE" ||
            webhook_code === "HISTORICAL_UPDATE"
          ) {
            // Trigger transaction sync
            // In production, you might want to queue this job
            logger.info(`Transaction update webhook for item ${item_id}`);
          }
          break;

        case "ITEM":
          if (webhook_code === "ERROR") {
            // Update item error status
            await db("plaid_items").where("item_id", item_id).update({
              error_code: req.body.error?.error_code,
              error_message: req.body.error?.error_message,
              last_failed_update: new Date(),
              updated_at: new Date(),
            });
          }
          break;
      }

      res.status(200).json({ status: "ok" });
    } catch (error) {
      logger.error("Webhook handling error:", error);
      res.status(500).json({ status: "error" });
    }
  }
}
