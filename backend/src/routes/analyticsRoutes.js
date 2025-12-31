import express from "express";
import { getAdminStats } from "../controllers/analyticsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, adminOnly, getAdminStats);

export default router;
