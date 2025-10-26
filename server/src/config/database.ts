import knex from "knex";
import { logger } from "@/utils/logger";

const config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "budger",
    user: process.env.DB_USER || "budger_user",
    password: process.env.DB_PASSWORD || "password",
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  },
  migrations: {
    directory: "./src/database/migrations",
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./src/database/seeds",
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
};

export const db = knex(config);

export async function connectDatabase(): Promise<void> {
  try {
    await db.raw("SELECT 1");
    logger.info("Database connection established");
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await db.destroy();
    logger.info("Database connection closed");
  } catch (error) {
    logger.error("Error closing database connection:", error);
    throw error;
  }
}
