import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { BOOKING_STATUS } from "../utils/constants.js";
import sendEmail from "../utils/sendEmail.js";
import { bookingConfirmedTemplate } from "../utils/emailTemplates.js";

/* ================= PAYMENT → BOOKING LINK ================= */

// @route   POST /api/payment-link/confirm
// @access  User
export const confirmPaymentAndBooking = asyncHandler(async (req, res) => {
  const {
    bookingId,
    provider,
    providerPaymentId,
    amount,
    status
  } = req.body;

  if (
    !bookingId ||
    !provider ||
    !providerPaymentId ||
    !amount ||
    !status
  ) {
    throw new ApiError(400, "All payment fields are required");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status !== BOOKING_STATUS.PENDING) {
    throw new ApiError(400, "Booking already processed");
  }

  // Save payment record
  await Payment.create({
    booking: booking._id,
    user: booking.user,
    provider,
    providerPaymentId,
    amount,
    status
  });

  // On successful payment
  if (status === "success") {
    booking.status = BOOKING_STATUS.CONFIRMED;
    await booking.save();

    // Mark room unavailable
    await Room.findByIdAndUpdate(booking.room, {
      available: false
    });

    // Send confirmation email
    const user = await User.findById(booking.user);

    await sendEmail({
      to: user.email,
      subject: "StaySync – Booking Confirmed 🎉",
      html: bookingConfirmedTemplate(user.name, booking._id)
    });
  }

  res.json({
    success: true,
    message: "Payment processed and booking updated"
  });
});
