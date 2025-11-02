import { Router, Response } from "express";
import pool from "../config/database";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

interface Category {
  id: number;
  user_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface CreateCategoryBody {
  name: string;
}

// GET /categories - Get all categories for the authenticated user
router.get(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await pool.query<Category>(
        "SELECT id, user_id, name, created_at, updated_at FROM categories WHERE user_id = $1 ORDER BY name ASC",
        [req.user!.id]
      );

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: "Failed to fetch categories",
        message: errorMessage,
      });
    }
  }
);

// POST /categories - Create a new category for the authenticated user
router.post(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { name }: CreateCategoryBody = req.body;

      // Validate required fields
      if (!name || typeof name !== "string" || name.trim() === "") {
        res.status(400).json({
          success: false,
          error: "Category name is required and must be a non-empty string",
        });
        return;
      }

      const trimmedName = name.trim();

      // Check if category with this name already exists for this user
      const existingCategory = await pool.query<Category>(
        "SELECT id FROM categories WHERE user_id = $1 AND LOWER(name) = LOWER($2)",
        [req.user!.id, trimmedName]
      );

      if (existingCategory.rows.length > 0) {
        res.status(409).json({
          success: false,
          error: "Category with this name already exists",
        });
        return;
      }

      // Create category
      const result = await pool.query<Category>(
        "INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING id, user_id, name, created_at, updated_at",
        [req.user!.id, trimmedName]
      );

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating category:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: "Failed to create category",
        message: errorMessage,
      });
    }
  }
);

// DELETE /categories/:id - Delete a category for the authenticated user
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // First check if category exists and belongs to user
      const checkResult = await pool.query<Category>(
        "SELECT id FROM categories WHERE id = $1 AND user_id = $2",
        [id, req.user!.id]
      );

      if (checkResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: "Category not found",
        });
        return;
      }

      // Delete category
      await pool.query(
        "DELETE FROM categories WHERE id = $1 AND user_id = $2",
        [id, req.user!.id]
      );

      res.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: "Failed to delete category",
        message: errorMessage,
      });
    }
  }
);

export default router;
