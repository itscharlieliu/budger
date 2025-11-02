import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../config/database";
import {
  generateToken,
  authenticateToken,
  AuthenticatedRequest,
} from "../middleware/auth";

const router = Router();

interface User {
  id: number;
  email: string;
  name: string;
  password_hash?: string;
  created_at?: Date;
}

interface CreateUserBody {
  email: string;
  name: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// POST /users/register - Create a new user
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password }: CreateUserBody = req.body;

    // Validate required fields
    if (!email || !name || !password) {
      res.status(400).json({
        success: false,
        error: "Email, name, and password are required",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
      return;
    }

    // Validate password length
    if (password.length < 1) {
      res.status(400).json({
        success: false,
        error: "Password must be at least 1 character long",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await pool.query<User>(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query<User>(
      "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at",
      [email, name, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          created_at: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      error: "Failed to create user",
      message: errorMessage,
    });
  }
});

// POST /users/login - Login user and get token
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginBody = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
      return;
    }

    // Find user by email
    const result = await pool.query<User>(
      "SELECT id, email, name, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
      return;
    }

    const user = result.rows[0];

    // Verify password
    if (!user.password_hash) {
      res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      error: "Login failed",
      message: errorMessage,
    });
  }
});

// GET /users/me - Get current user information (requires authentication)
router.get(
  "/me",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response): void => {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  }
);

export default router;
