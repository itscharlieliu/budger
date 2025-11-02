import { Router, Request, Response } from "express";

const router = Router();

// GET /health - Health check endpoint
router.get("/", (req: Request, res: Response): void => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "budger-server",
  });
});

export default router;
