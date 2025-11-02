import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "budger",
  user: process.env.DB_USER || "charlie",
  password: process.env.DB_PASSWORD || "",
});

// Test database connection
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

export default pool;
