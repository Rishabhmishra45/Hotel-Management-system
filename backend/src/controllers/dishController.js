import Dish from "../models/Dish.js";
import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

/* ================= ADMIN ================= */

// @route POST /api/dishes
export const createDish = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      throw new ApiError(400, "All fields are required");
    }

    if (!req.file) {
      throw new ApiError(400, "Dish image is required");
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "staysync/dishes" }
    );

    const dish = await Dish.create({
      name,
      description,
      price,
      image: {
        public_id: result.public_id,
        url: result.secure_url
      }
    });

    res.status(201).json({
      success: true,
      dish
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/dishes/:id
export const updateDish = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) throw new ApiError(404, "Dish not found");

    if (req.file) {
      await cloudinary.uploader.destroy(dish.image.public_id);

      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "staysync/dishes" }
      );

      dish.image = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    Object.assign(dish, req.body);
    await dish.save();

    res.json({
      success: true,
      dish
    });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/dishes/:id
export const deleteDish = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) throw new ApiError(404, "Dish not found");

    await cloudinary.uploader.destroy(dish.image.public_id);
    await dish.deleteOne();

    res.json({
      success: true,
      message: "Dish deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

/* ================= PUBLIC ================= */

// @route GET /api/dishes
export const getDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find();
    res.json({
      success: true,
      count: dishes.length,
      dishes
    });
  } catch (error) {
    next(error);
  }
};
