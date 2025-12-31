import express from "express";
import { confirmPaymentAndBooking } from "../controllers/paymentLinkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/confirm", protect, confirmPaymentAndBooking);

export default router;
