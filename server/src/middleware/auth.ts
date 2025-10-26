import { Request, Response, NextFunction } from "express";
import { AuthUtils } from "@/utils/auth";
import { db } from "@/config/database";
import { User } from "@/types";
import { logger } from "@/utils/logger";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = AuthUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Access token required",
      });
      return;
    }

    // Verify the token
    const payload = AuthUtils.verifyToken(token);

    // Get user from database
    const user = await db("users").where("id", payload.user_id).first();

    if (!user) {
      res.status(401).json({
        success: false,
        error: "Invalid token - user not found",
      });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
};

/**
 * Middleware to optionally authenticate JWT tokens
 * Used for endpoints that work with or without authentication
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = AuthUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const payload = AuthUtils.verifyToken(token);
      const user = await db("users").where("id", payload.user_id).first();

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};
