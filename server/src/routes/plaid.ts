import { Router } from "express";
import { PlaidController } from "@/controllers/plaidController";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

// Public webhook endpoint (no auth required)
router.post("/webhook", PlaidController.handleWebhook);

// Protected routes
router.use(authenticateToken);

// router.post("/link-token", PlaidController.createLinkToken);
// router.post("/exchange-token", PlaidController.exchangeToken);
// router.get("/items", PlaidController.getItems);
// router.post("/items/:item_id/sync", PlaidController.syncTransactions);
// router.delete("/items/:item_id", PlaidController.removeItem);

export default router;
