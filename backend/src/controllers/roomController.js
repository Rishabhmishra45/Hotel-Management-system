import Room from "../models/Room.js";
import ApiError from "../utils/ApiError.js";

/* ================= ADMIN ================= */

// @route POST /api/rooms
export const createRoom = async (req, res, next) => {
  try {
    const { title, description, pricePerNight, capacity } = req.body;

    if (!title || !description || !pricePerNight || !capacity) {
      throw new ApiError(400, "All fields are required");
    }

    const room = await Room.create({
      title,
      description,
      pricePerNight,
      capacity
    });

    res.status(201).json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/rooms/:id
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) throw new ApiError(404, "Room not found");

    Object.assign(room, req.body);
    await room.save();

    res.json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/rooms/:id
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) throw new ApiError(404, "Room not found");

    await room.deleteOne();

    res.json({
      success: true,
      message: "Room deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

/* ================= PUBLIC ================= */

// @route GET /api/rooms
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    next(error);
  }
};
