import { Router } from "express";
import { TransactionController } from "@/controllers/transactionController";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", TransactionController.getTransactions);
router.get("/:id", TransactionController.getTransaction);
router.post("/", TransactionController.createTransaction);
router.put("/:id", TransactionController.updateTransaction);
router.delete("/:id", TransactionController.deleteTransaction);
router.post("/categorize", TransactionController.categorizeTransactions);

export default router;
