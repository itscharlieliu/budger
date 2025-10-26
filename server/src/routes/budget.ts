import { Router } from "express";
import { Request, Response } from "express";
import Joi from "joi";
import { db } from "@/config/database";
import { logger } from "@/utils/logger";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

// Validation schemas
const createBudgetGroupSchema = Joi.object({
  name: Joi.string().min(1).required(),
  sort_order: Joi.number().integer().default(0),
});

const createBudgetCategorySchema = Joi.object({
  budget_group_id: Joi.string().uuid().required(),
  name: Joi.string().min(1).required(),
  sort_order: Joi.number().integer().default(0),
});

const createMonthlyBudgetSchema = Joi.object({
  budget_category_id: Joi.string().uuid().required(),
  month_code: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required(),
  budgeted_amount: Joi.number().required(),
});

// Budget Groups Controller
class BudgetGroupController {
  static async getGroups(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const groups = await db("budget_groups")
        .where("user_id", req.user.id)
        .where("is_active", true)
        .orderBy("sort_order")
        .orderBy("name");

      res.json({ success: true, data: groups });
    } catch (error) {
      logger.error("Get budget groups error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to get budget groups" });
    }
  }

  static async createGroup(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const { error, value } = createBudgetGroupSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const { name, sort_order } = value;

      // Check if group name already exists
      const existingGroup = await db("budget_groups")
        .where("user_id", req.user.id)
        .where("name", name)
        .where("is_active", true)
        .first();

      if (existingGroup) {
        res.status(409).json({
          success: false,
          error: "Budget group with this name already exists",
        });
        return;
      }

      const [group] = await db("budget_groups")
        .insert({
          user_id: req.user.id,
          name,
          sort_order,
        })
        .returning("*");

      res.status(201).json({ success: true, data: group });
    } catch (error) {
      logger.error("Create budget group error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to create budget group" });
    }
  }
}

// Budget Categories Controller
class BudgetCategoryController {
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const categories = await db("budget_categories")
        .leftJoin(
          "budget_groups",
          "budget_categories.budget_group_id",
          "budget_groups.id"
        )
        .where("budget_categories.user_id", req.user.id)
        .where("budget_categories.is_active", true)
        .select("budget_categories.*", "budget_groups.name as group_name")
        .orderBy("budget_groups.sort_order")
        .orderBy("budget_categories.sort_order")
        .orderBy("budget_categories.name");

      res.json({ success: true, data: categories });
    } catch (error) {
      logger.error("Get budget categories error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to get budget categories" });
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const { error, value } = createBudgetCategorySchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const { budget_group_id, name, sort_order } = value;

      // Verify group belongs to user
      const group = await db("budget_groups")
        .where("id", budget_group_id)
        .where("user_id", req.user.id)
        .where("is_active", true)
        .first();

      if (!group) {
        res.status(404).json({
          success: false,
          error: "Budget group not found",
        });
        return;
      }

      // Check if category name already exists in this group
      const existingCategory = await db("budget_categories")
        .where("budget_group_id", budget_group_id)
        .where("name", name)
        .where("is_active", true)
        .first();

      if (existingCategory) {
        res.status(409).json({
          success: false,
          error: "Budget category with this name already exists in this group",
        });
        return;
      }

      const [category] = await db("budget_categories")
        .insert({
          user_id: req.user.id,
          budget_group_id,
          name,
          sort_order,
        })
        .returning("*");

      res.status(201).json({ success: true, data: category });
    } catch (error) {
      logger.error("Create budget category error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to create budget category" });
    }
  }
}

// Monthly Budget Controller
class MonthlyBudgetController {
  static async getBudgets(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const { month_code } = req.query;

      let query = db("monthly_budgets")
        .leftJoin(
          "budget_categories",
          "monthly_budgets.budget_category_id",
          "budget_categories.id"
        )
        .leftJoin(
          "budget_groups",
          "budget_categories.budget_group_id",
          "budget_groups.id"
        )
        .where("monthly_budgets.user_id", req.user.id)
        .select(
          "monthly_budgets.*",
          "budget_categories.name as category_name",
          "budget_groups.name as group_name"
        );

      if (month_code) {
        query = query.where("monthly_budgets.month_code", month_code);
      }

      const budgets = await query
        .orderBy("budget_groups.sort_order")
        .orderBy("budget_categories.sort_order")
        .orderBy("budget_categories.name");

      res.json({ success: true, data: budgets });
    } catch (error) {
      logger.error("Get monthly budgets error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to get monthly budgets" });
    }
  }

  static async createBudget(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Authentication required" });
        return;
      }

      const { error, value } = createMonthlyBudgetSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const { budget_category_id, month_code, budgeted_amount } = value;

      // Verify category belongs to user
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

      // Check if budget already exists for this category and month
      const existingBudget = await db("monthly_budgets")
        .where("budget_category_id", budget_category_id)
        .where("month_code", month_code)
        .first();

      if (existingBudget) {
        res.status(409).json({
          success: false,
          error: "Budget already exists for this category and month",
        });
        return;
      }

      const [budget] = await db("monthly_budgets")
        .insert({
          user_id: req.user.id,
          budget_category_id,
          month_code,
          budgeted_amount,
        })
        .returning("*");

      res.status(201).json({ success: true, data: budget });
    } catch (error) {
      logger.error("Create monthly budget error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to create monthly budget" });
    }
  }
}

// Routes
router.use(authenticateToken);

// Budget Groups
router.get("/groups", BudgetGroupController.getGroups);
router.post("/groups", BudgetGroupController.createGroup);

// Budget Categories
router.get("/categories", BudgetCategoryController.getCategories);
router.post("/categories", BudgetCategoryController.createCategory);

// Monthly Budgets
router.get("/monthly", MonthlyBudgetController.getBudgets);
router.post("/monthly", MonthlyBudgetController.createBudget);

export default router;
