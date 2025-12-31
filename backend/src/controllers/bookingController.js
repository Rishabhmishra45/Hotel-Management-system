import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { BOOKING_STATUS } from "../utils/constants.js";
import sendEmail from "../utils/sendEmail.js";
import { bookingCreatedTemplate } from "../utils/emailTemplates.js";

/* ================= USER ================= */

// @route   POST /api/bookings
// @access  User
export const createBooking = asyncHandler(async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;

  if (!roomId || !checkInDate || !checkOutDate) {
    throw new ApiError(400, "All fields are required");
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const today = new Date();

  if (checkIn < today || checkOut <= checkIn) {
    throw new ApiError(400, "Invalid booking dates");
  }

  const room = await Room.findById(roomId);
  if (!room || !room.available) {
    throw new ApiError(400, "Room not available");
  }

  const nights =
    (checkOut.getTime() - checkIn.getTime()) /
    (1000 * 60 * 60 * 24);

  const totalPrice = nights * room.pricePerNight;

  const booking = await Booking.create({
    user: req.user.id,
    room: roomId,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    totalPrice,
    status: BOOKING_STATUS.PENDING
  });

  // Fetch user for email
  const user = await User.findById(req.user.id);

  // Send booking created email
  await sendEmail({
    to: user.email,
    subject: "StaySync – Booking Created",
    html: bookingCreatedTemplate(user.name, booking._id)
  });

  res.status(201).json({
    success: true,
    booking
  });
});

// @route   GET /api/bookings/my
// @access  User
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("room", "title pricePerNight");

  res.json({
    success: true,
    count: bookings.length,
    bookings
  });
});

/* ================= ADMIN ================= */

// GET /api/bookings - Get all bookings
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email phone')
    .populate('room', 'title description pricePerNight')
    .sort({ createdAt: -1 }) // Sort by newest first

  res.json({
    success: true,
    count: bookings.length,
    bookings
  })
})

// PUT /api/bookings/:id/status - Update booking status
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const { id } = req.params

  if (!Object.values(BOOKING_STATUS).includes(status)) {
    throw new ApiError(400, 'Invalid booking status')
  }

  const booking = await Booking.findById(id)
  if (!booking) {
    throw new ApiError(404, 'Booking not found')
  }

  booking.status = status
  await booking.save()

  res.json({
    success: true,
    booking
  })
})