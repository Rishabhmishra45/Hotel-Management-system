import express from "express";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getRooms
} from "../controllers/roomController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getRooms);

// Admin
router.post("/", protect, adminOnly, createRoom);
router.put("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;
