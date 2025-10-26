import { Router } from "express";
import { Request, Response } from "express";
import { db } from "@/config/database";
import { logger } from "@/utils/logger";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

class UserController {
  /**
   * Get user statistics
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const userId = req.user.id;

      // Get account count
      const accountCount = await db("accounts")
        .where("user_id", userId)
        .where("is_active", true)
        .count("* as count")
        .first();

      // Get transaction count
      const transactionCount = await db("transactions")
        .where("user_id", userId)
        .count("* as count")
        .first();

      // Get total balance
      const totalBalance = await db("accounts")
        .where("user_id", userId)
        .where("is_active", true)
        .sum("cached_balance as total")
        .first();

      // Get monthly spending (current month)
      const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
      const monthlySpending = await db("transactions")
        .where("user_id", userId)
        .where("amount", "<", 0) // Expenses are negative
        .whereRaw("to_char(date, 'YYYY-MM') = ?", [currentMonth])
        .sum("amount as total")
        .first();

      // Get categorized transaction count
      const categorizedCount = await db("transactions")
        .where("user_id", userId)
        .whereNotNull("budget_category_id")
        .count("* as count")
        .first();

      res.json({
        success: true,
        data: {
          accounts: parseInt(accountCount?.count as string) || 0,
          transactions: parseInt(transactionCount?.count as string) || 0,
          total_balance: parseFloat(totalBalance?.total as string) || 0,
          monthly_spending: Math.abs(
            parseFloat(monthlySpending?.total as string) || 0
          ),
          categorized_transactions:
            parseInt(categorizedCount?.count as string) || 0,
        },
      });
    } catch (error) {
      logger.error("Get user stats error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user statistics",
      });
    }
  }

  /**
   * Get user dashboard data
   */
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const userId = req.user.id;

      // Get recent transactions (last 10)
      const recentTransactions = await db("transactions")
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
        .where("transactions.user_id", userId)
        .select(
          "transactions.*",
          "budget_categories.name as category_name",
          "budget_groups.name as group_name",
          "accounts.name as account_name"
        )
        .orderBy("transactions.date", "desc")
        .orderBy("transactions.created_at", "desc")
        .limit(10);

      // Get accounts with balances
      const accounts = await db("accounts")
        .where("user_id", userId)
        .where("is_active", true)
        .orderBy("name");

      // Get monthly spending by category (current month)
      const currentMonth = new Date().toISOString().substring(0, 7);
      const monthlySpending = await db("transactions")
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
        .where("transactions.user_id", userId)
        .where("transactions.amount", "<", 0) // Expenses are negative
        .whereRaw("to_char(transactions.date, 'YYYY-MM') = ?", [currentMonth])
        .select(
          "budget_categories.name as category_name",
          "budget_groups.name as group_name",
          db.raw("SUM(ABS(transactions.amount)) as total_spent")
        )
        .groupBy("budget_categories.name", "budget_groups.name")
        .orderBy("total_spent", "desc")
        .limit(10);

      res.json({
        success: true,
        data: {
          recent_transactions: recentTransactions,
          accounts,
          monthly_spending_by_category: monthlySpending,
        },
      });
    } catch (error) {
      logger.error("Get dashboard error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get dashboard data",
      });
    }
  }
}

// Routes
router.use(authenticateToken);

router.get("/stats", UserController.getStats);
router.get("/dashboard", UserController.getDashboard);

export default router;
