import { Router } from "express";
import { AccountController } from "@/controllers/accountController";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", AccountController.getAccounts);
router.get("/:id", AccountController.getAccount);
router.post("/", AccountController.createAccount);
router.put("/:id", AccountController.updateAccount);
router.delete("/:id", AccountController.deleteAccount);
router.patch("/:id/balance", AccountController.updateBalance);

export default router;
