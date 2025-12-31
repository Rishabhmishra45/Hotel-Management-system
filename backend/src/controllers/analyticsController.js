import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Dish from "../models/Dish.js";

export const getAdminStats = async (req, res) => {
  const [users, bookings, rooms, dishes] = await Promise.all([
    User.countDocuments(),
    Booking.countDocuments(),
    Room.countDocuments(),
    Dish.countDocuments()
  ]);

  const revenue = await Booking.aggregate([
    { $match: { status: "confirmed" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);

  res.json({
    success: true,
    stats: {
      users,
      bookings,
      rooms,
      dishes,
      revenue: revenue[0]?.total || 0
    }
  });
};
