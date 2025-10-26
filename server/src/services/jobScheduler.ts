import cron from "node-cron";
import { db } from "@/config/database";
import { logger } from "@/utils/logger";
import { PlaidService } from "@/services/plaid";
import { CategorizationService } from "@/services/categorization";

export class JobScheduler {
  private static isRunning = false;

  /**
   * Start all scheduled jobs
   */
  static start(): void {
    if (this.isRunning) {
      logger.warn("Job scheduler is already running");
      return;
    }

    this.isRunning = true;
    logger.info("Starting job scheduler...");

    // Daily transaction sync job - runs at 2 AM every day
    cron.schedule("0 2 * * *", async () => {
      logger.info("Starting daily transaction sync job");
      await this.syncAllTransactions();
    });

    // Categorization job - runs at 3 AM every day
    cron.schedule("0 3 * * *", async () => {
      logger.info("Starting daily categorization job");
      await this.categorizeUncategorizedTransactions();
    });

    // Cleanup job - runs weekly on Sunday at 4 AM
    cron.schedule("0 4 * * 0", async () => {
      logger.info("Starting weekly cleanup job");
      await this.cleanupOldData();
    });

    logger.info("Job scheduler started successfully");
  }

  /**
   * Stop all scheduled jobs
   */
  static stop(): void {
    if (!this.isRunning) {
      logger.warn("Job scheduler is not running");
      return;
    }

    cron.getTasks().forEach((task) => task.destroy());
    this.isRunning = false;
    logger.info("Job scheduler stopped");
  }

  /**
   * Sync transactions for all Plaid items
   */
  private static async syncAllTransactions(): Promise<void> {
    try {
      const plaidItems = await db("plaid_items")
        .whereNotNull("access_token")
        .whereNull("error_code")
        .select("*");

      logger.info(`Found ${plaidItems.length} Plaid items to sync`);

      for (const item of plaidItems) {
        try {
          await this.syncItemTransactions(item);
        } catch (error) {
          logger.error(
            `Failed to sync transactions for item ${item.id}:`,
            error
          );

          // Update item with error
          await db("plaid_items")
            .where("id", item.id)
            .update({
              last_failed_update: new Date(),
              error_code: "SYNC_ERROR",
              error_message:
                error instanceof Error ? error.message : "Unknown error",
              updated_at: new Date(),
            });
        }
      }

      logger.info("Daily transaction sync completed");
    } catch (error) {
      logger.error("Daily transaction sync failed:", error);
    }
  }

  /**
   * Sync transactions for a specific Plaid item
   */
  private static async syncItemTransactions(item: any): Promise<void> {
    try {
      // Get date range (last 7 days to catch any missed transactions)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      // Get transactions from Plaid
      const plaidTransactions = await PlaidService.getTransactions(
        item.access_token,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );

      // Get user's accounts for this item
      const accounts = await db("accounts")
        .where("plaid_item_id", item.id)
        .where("user_id", item.user_id);

      const accountMap = new Map(
        accounts.map((acc) => [acc.plaid_account_id, acc.id])
      );

      let newTransactions = 0;
      let updatedTransactions = 0;

      for (const plaidTransaction of plaidTransactions) {
        const accountId = accountMap.get(plaidTransaction.account_id);
        if (!accountId) continue;

        // Check if transaction already exists
        const existingTransaction = await db("transactions")
          .where("plaid_transaction_id", plaidTransaction.transaction_id)
          .where("user_id", item.user_id)
          .first();

        const transactionData = {
          user_id: item.user_id,
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
      await db("plaid_items").where("id", item.id).update({
        last_successful_update: new Date(),
        error_code: null,
        error_message: null,
        updated_at: new Date(),
      });

      logger.info(
        `Synced item ${item.institution_name}: ${newTransactions} new, ${updatedTransactions} updated`
      );
    } catch (error) {
      logger.error(`Error syncing item ${item.id}:`, error);
      throw error;
    }
  }

  /**
   * Categorize uncategorized transactions
   */
  private static async categorizeUncategorizedTransactions(): Promise<void> {
    try {
      // Get users with uncategorized transactions
      const usersWithUncategorized = await db("transactions")
        .whereNull("budget_category_id")
        .whereNull("categorized_at")
        .select("user_id")
        .distinct();

      logger.info(
        `Found ${usersWithUncategorized.length} users with uncategorized transactions`
      );

      for (const { user_id } of usersWithUncategorized) {
        try {
          await this.categorizeUserTransactions(user_id);
        } catch (error) {
          logger.error(
            `Failed to categorize transactions for user ${user_id}:`,
            error
          );
        }
      }

      logger.info("Daily categorization completed");
    } catch (error) {
      logger.error("Daily categorization failed:", error);
    }
  }

  /**
   * Categorize transactions for a specific user
   */
  private static async categorizeUserTransactions(
    userId: string
  ): Promise<void> {
    try {
      // Get uncategorized transactions (limit to 50 per run to avoid rate limits)
      const transactions = await db("transactions")
        .where("user_id", userId)
        .whereNull("budget_category_id")
        .whereNull("categorized_at")
        .limit(50)
        .select("id", "payee", "description", "amount");

      if (transactions.length === 0) {
        return;
      }

      // Get available categories
      const categories = await db("budget_categories")
        .where("user_id", userId)
        .where("is_active", true)
        .select("id", "name");

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
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        const result = categorizationResults[i];

        if (result.confidence > 60) {
          // Only apply if confidence > 60%
          const category = categories.find((c) => c.name === result.category);
          if (category) {
            await db("transactions").where("id", transaction.id).update({
              budget_category_id: category.id,
              categorized_at: new Date(),
              updated_at: new Date(),
            });
          }
        }
      }

      logger.info(
        `Categorized ${transactions.length} transactions for user ${userId}`
      );
    } catch (error) {
      logger.error(
        `Error categorizing transactions for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Cleanup old data
   */
  private static async cleanupOldData(): Promise<void> {
    try {
      // Clean up old import jobs (older than 30 days)
      const deletedImportJobs = await db("import_jobs")
        .where(
          "created_at",
          "<",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        )
        .del();

      // Clean up old error logs (older than 7 days)
      const deletedErrorLogs = await db("plaid_items")
        .where(
          "last_failed_update",
          "<",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        )
        .whereNotNull("error_code")
        .update({
          error_code: null,
          error_message: null,
          updated_at: new Date(),
        });

      logger.info(
        `Cleanup completed: ${deletedImportJobs} import jobs deleted, ${deletedErrorLogs} error logs cleared`
      );
    } catch (error) {
      logger.error("Cleanup job failed:", error);
    }
  }

  /**
   * Manual trigger for transaction sync
   */
  static async triggerTransactionSync(): Promise<void> {
    logger.info("Manual transaction sync triggered");
    await this.syncAllTransactions();
  }

  /**
   * Manual trigger for categorization
   */
  static async triggerCategorization(): Promise<void> {
    logger.info("Manual categorization triggered");
    await this.categorizeUncategorizedTransactions();
  }
}
