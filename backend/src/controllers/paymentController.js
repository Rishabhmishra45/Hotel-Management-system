import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import getRazorpayInstance from "../config/razorpay.js";
import stripe from "../config/stripe.js";

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    throw new ApiError(400, "Amount is required");
  }

  const razorpay = getRazorpayInstance();

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  });

  res.json({
    success: true,
    order
  });
});

export const createStripeIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    throw new ApiError(400, "Amount is required");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd"
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});
