import express from "express";
import {
  createDish,
  updateDish,
  deleteDish,
  getDishes
} from "../controllers/dishController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../utils/uploadImage.js";

const router = express.Router();

// Public
router.get("/", getDishes);

// Admin
router.post("/", protect, adminOnly, upload.single("image"), createDish);
router.put("/:id", protect, adminOnly, upload.single("image"), updateDish);
router.delete("/:id", protect, adminOnly, deleteDish);

export default router;
