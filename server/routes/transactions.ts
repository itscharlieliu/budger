import { Router, Response, Request } from "express";
import pool from "../config/database";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string | null;
  transaction_type: "income" | "expense" | "transfer";
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
  user_name?: string;
  user_email?: string;
  account_name?: string;
  account_type?: string;
}

interface CreateTransactionBody {
  account: string;
  payee: string;
  date: string;
  category?: string;
  note?: string;
  activity: number;
}

// GET /transactions - Fetch all transactions for the authenticated user
router.get(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const query = `
      SELECT 
        t.id,
        t.amount,
        t.description,
        t.category,
        t.transaction_type,
        t.transaction_date,
        t.created_at,
        t.updated_at,
        u.name as user_name,
        u.email as user_email,
        a.name as account_name,
        a.account_type
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      JOIN accounts a ON t.account_id = a.id
      WHERE t.user_id = $1
      ORDER BY t.transaction_date DESC, t.created_at DESC
    `;

      const result = await pool.query<Transaction>(query, [req.user!.id]);

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: "Failed to fetch transactions",
        message: errorMessage,
      });
    }
  }
);

// POST /transactions - Create a new transaction for the authenticated user
router.post(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const {
        account,
        payee,
        date,
        category,
        note,
        activity,
      }: CreateTransactionBody = req.body;

      // Validate required fields
      if (!account || !payee || !date) {
        res.status(400).json({
          success: false,
          error: "Account, payee, and date are required",
        });
        return;
      }

      // Look up account_id from account name
      const accountResult = await pool.query<{ id: number }>(
        "SELECT id FROM accounts WHERE name = $1 AND user_id = $2",
        [account, req.user!.id]
      );

      if (accountResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: "Account not found",
        });
        return;
      }

      const accountId = accountResult.rows[0].id;

      // Determine transaction_type and amount from activity
      // activity is in cents (positive for income, negative for expense)
      const amount = Math.abs(activity) / 100; // Convert cents to dollars
      let transactionType: "income" | "expense" | "transfer" = "expense";
      if (activity > 0) {
        transactionType = "income";
      } else if (activity === 0) {
        transactionType = "transfer";
      }

      // Parse date
      const transactionDate = new Date(date);

      // Combine payee and note for description
      let description = payee;
      if (note && note.trim() !== "" && note !== payee) {
        description = `${payee} - ${note}`;
      }

      // Create transaction
      const result = await pool.query<Transaction>(
        `INSERT INTO transactions (user_id, account_id, amount, description, category, transaction_type, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, amount, description, category, transaction_type, transaction_date, created_at, updated_at`,
        [
          req.user!.id,
          accountId,
          amount,
          description,
          category || null,
          transactionType,
          transactionDate,
        ]
      );

      res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: "Failed to create transaction",
        message: errorMessage,
      });
    }
  }
);

// DELETE /transactions/:id - Delete a transaction for the authenticated user
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // First check if transaction exists and belongs to user
      const checkResult = await pool.query<{ id: number }>(
        "SELECT id FROM transactions WHERE id = $1 AND user_id = $2",
        [id, req.user!.id]
      );

      if (checkResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: "Transaction not found",
        });
        return;
      }

      // Delete transaction
      await pool.query(
        "DELETE FROM transactions WHERE id = $1 AND user_id = $2",
        [id, req.user!.id]
      );

      res.json({
        success: true,
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: "Failed to delete transaction",
        message: errorMessage,
      });
    }
  }
);

export default router;
