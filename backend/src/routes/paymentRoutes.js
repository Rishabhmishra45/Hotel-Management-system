import express from "express";
import {
  createRazorpayOrder,
  createStripeIntent
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/razorpay", protect, createRazorpayOrder);
router.post("/stripe", protect, createStripeIntent);

export default router;
