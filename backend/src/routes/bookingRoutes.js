import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus
} from "../controllers/bookingController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= USER ROUTES ================= */

// Create booking
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/my", protect, getMyBookings);

/* ================= ADMIN ROUTES ================= */

// Get all bookings
router.get("/", protect, adminOnly, getAllBookings);

// Update booking status
router.put("/:id/status", protect, adminOnly, updateBookingStatus);

/* ================= EXPORT ================= */

export default router;
