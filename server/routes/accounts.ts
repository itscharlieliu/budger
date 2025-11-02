import { Router, Response } from "express";
import pool from "../config/database";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

interface AccountType {
  id: number;
  name: string;
  account_type: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

type AccountTypeValue =
  | "checking"
  | "savings"
  | "credit"
  | "investment"
  | "loan";

// GET /accounts - Get all accounts for the authenticated user
router.get(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await pool.query<AccountType>(
        "SELECT id, name, account_type, balance, created_at, updated_at FROM accounts WHERE user_id = $1 ORDER BY created_at DESC",
        [req.user!.id]
      );

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
      });
    } catch (error) {
      console.error("Error fetching accounts:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: "Failed to fetch accounts",
        message: errorMessage,
      });
    }
  }
);

// POST /accounts - Create a new account for the authenticated user
router.post(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { name, account_type, balance = 0.0 } = req.body;

      // Validate required fields
      if (!name || !account_type) {
        res.status(400).json({
          success: false,
          error: "Name and account_type are required",
        });
        return;
      }

      // Validate account_type
      const validTypes: AccountTypeValue[] = [
        "checking",
        "savings",
        "credit",
        "investment",
        "loan",
      ];
      if (!validTypes.includes(account_type)) {
        res.status(400).json({
          success: false,
          error:
            "Invalid account_type. Must be one of: " + validTypes.join(", "),
        });
        return;
      }

      // Validate balance is a number
      const balanceNum = parseFloat(balance);
      if (isNaN(balanceNum)) {
        res.status(400).json({
          success: false,
          error: "Balance must be a valid number",
        });
        return;
      }

      // Create account
      const result = await pool.query<AccountType>(
        "INSERT INTO accounts (user_id, name, account_type, balance) VALUES ($1, $2, $3, $4) RETURNING id, name, account_type, balance, created_at, updated_at",
        [req.user!.id, name, account_type, balanceNum]
      );

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating account:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: "Failed to create account",
        message: errorMessage,
      });
    }
  }
);

// GET /accounts/:id - Get a specific account for the authenticated user
router.get(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const result = await pool.query<AccountType>(
        "SELECT id, name, account_type, balance, created_at, updated_at FROM accounts WHERE id = $1 AND user_id = $2",
        [id, req.user!.id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: "Account not found",
        });
        return;
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error fetching account:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: "Failed to fetch account",
        message: errorMessage,
      });
    }
  }
);

export default router;
