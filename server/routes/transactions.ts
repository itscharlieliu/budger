import { Router, Response, Request } from "express";
import pool from "../config/database";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

interface Transaction {
  id: number;
  amount: number;
  payee: string | null;
  description: string;
  category_id: number | null;
  category_name?: string | null;
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
  account_id: number;
  user_name?: string;
  user_email?: string;
  account_name?: string;
  account_type?: string;
}

interface CreateTransactionBody {
  account_id: number;
  payee: string;
  date: string;
  category_id?: number;
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
        t.payee,
        t.description,
        t.category_id,
        c.name as category_name,
        t.transaction_date,
        t.created_at,
        t.updated_at,
        t.account_id,
        u.name as user_name,
        u.email as user_email,
        a.name as account_name,
        a.account_type
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      JOIN accounts a ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
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
        account_id,
        payee,
        date,
        category_id,
        note,
        activity,
      }: CreateTransactionBody = req.body;

      // Validate required fields
      if (!account_id || !payee || !date) {
        res.status(400).json({
          success: false,
          error: "Account ID, payee, and date are required",
        });
        return;
      }

      // Verify account exists and belongs to user
      const accountResult = await pool.query<{ id: number }>(
        "SELECT id FROM accounts WHERE id = $1 AND user_id = $2",
        [account_id, req.user!.id]
      );

      if (accountResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: "Account not found",
        });
        return;
      }

      // Verify category exists and belongs to user if category_id is provided
      if (category_id !== undefined && category_id !== null) {
        const categoryResult = await pool.query<{ id: number }>(
          "SELECT id FROM categories WHERE id = $1 AND user_id = $2",
          [category_id, req.user!.id]
        );

        if (categoryResult.rows.length === 0) {
          res.status(404).json({
            success: false,
            error: "Category not found",
          });
          return;
        }
      }

      // Determine amount from activity
      // activity is in cents (positive for income, negative for expense)
      const amount = activity / 100; // Convert cents to dollars

      // Parse date
      const transactionDate = new Date(date);

      // Set description to note if provided, otherwise null
      const description = note && note.trim() !== "" ? note : null;

      // Create transaction (category_id is null if not provided)
      const result = await pool.query<Transaction>(
        `INSERT INTO transactions (user_id, account_id, amount, payee, description, category_id, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING 
         id, 
         amount, 
         payee,
         description, 
         category_id, 
         transaction_date, 
         created_at, 
         updated_at,
         account_id`,
        [
          req.user!.id,
          account_id,
          amount,
          payee,
          description,
          category_id || null,
          transactionDate,
        ]
      );

      // Fetch the transaction with category name if category_id exists
      let transactionWithCategory = result.rows[0];
      if (transactionWithCategory.category_id) {
        const categoryResult = await pool.query<{ name: string }>(
          "SELECT name FROM categories WHERE id = $1",
          [transactionWithCategory.category_id]
        );
        if (categoryResult.rows.length > 0) {
          transactionWithCategory = {
            ...transactionWithCategory,
            category_name: categoryResult.rows[0].name,
          };
        }
      }

      res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: transactionWithCategory,
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
