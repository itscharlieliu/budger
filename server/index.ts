import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import usersRoutes from "./routes/users";
import accountsRoutes from "./routes/accounts";
import transactionsRoutes from "./routes/transactions";
import categoriesRoutes from "./routes/categories";
import healthRoutes from "./routes/health";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", usersRoutes);
app.use("/accounts", accountsRoutes);
app.use("/transactions", transactionsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/health", healthRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(
    `User registration: POST http://localhost:${PORT}/users/register`
  );
  console.log(`User login: POST http://localhost:${PORT}/users/login`);
  console.log(`Get user info: GET http://localhost:${PORT}/users/me`);
  console.log(`Create account: POST http://localhost:${PORT}/accounts`);
  console.log(`Get accounts: GET http://localhost:${PORT}/accounts`);
  console.log(`Get transactions: GET http://localhost:${PORT}/transactions`);
});

export default app;
