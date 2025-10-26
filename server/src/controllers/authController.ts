import { Request, Response } from "express";
import Joi from "joi";
import { AuthUtils } from "@/utils/auth";
import { db } from "@/config/database";
import { logger } from "@/utils/logger";
import { CreateUserRequest, LoginRequest, AuthResponse } from "@/types";

// Validation schemas
const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().min(1).required(),
  last_name: Joi.string().min(1).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = createUserSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const { email, password, first_name, last_name }: CreateUserRequest =
        value;

      // Check if user already exists
      const existingUser = await db("users").where("email", email).first();
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: "User with this email already exists",
        });
        return;
      }

      // Hash password
      const password_hash = await AuthUtils.hashPassword(password);

      // Create user
      const [user] = await db("users")
        .insert({
          email,
          password_hash,
          first_name,
          last_name,
        })
        .returning([
          "id",
          "email",
          "first_name",
          "last_name",
          "created_at",
          "updated_at",
        ]);

      // Generate token
      const token = AuthUtils.generateToken({
        user_id: user.id,
        email: user.email,
      });

      const response: AuthResponse = {
        user,
        token,
      };

      logger.info(`New user registered: ${email}`);
      res.status(201).json({
        success: true,
        data: response,
      });
    } catch (error) {
      logger.error("Registration error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to register user",
      });
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const { email, password }: LoginRequest = value;

      // Find user
      const user = await db("users").where("email", email).first();
      if (!user) {
        res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
        return;
      }

      // Verify password
      const isValidPassword = await AuthUtils.comparePassword(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
        return;
      }

      // Update last login
      await db("users")
        .where("id", user.id)
        .update({ last_login_at: new Date() });

      // Generate token
      const token = AuthUtils.generateToken({
        user_id: user.id,
        email: user.email,
      });

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          email_verified_at: user.email_verified_at,
          last_login_at: user.last_login_at,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        token,
      };

      logger.info(`User logged in: ${email}`);
      res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      logger.error("Login error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to login",
      });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const { password_hash, ...userProfile } = req.user;
      res.json({
        success: true,
        data: userProfile,
      });
    } catch (error) {
      logger.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get profile",
      });
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      const updateSchema = Joi.object({
        first_name: Joi.string().min(1),
        last_name: Joi.string().min(1),
        email: Joi.string().email(),
      });

      const { error, value } = updateSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      // Check if email is already taken by another user
      if (value.email && value.email !== req.user.email) {
        const existingUser = await db("users")
          .where("email", value.email)
          .where("id", "!=", req.user.id)
          .first();

        if (existingUser) {
          res.status(409).json({
            success: false,
            error: "Email already taken",
          });
          return;
        }
      }

      const [updatedUser] = await db("users")
        .where("id", req.user.id)
        .update({
          ...value,
          updated_at: new Date(),
        })
        .returning([
          "id",
          "email",
          "first_name",
          "last_name",
          "created_at",
          "updated_at",
        ]);

      res.json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      logger.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update profile",
      });
    }
  }
}
