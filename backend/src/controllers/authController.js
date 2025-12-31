import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/generateTokens.js";

/* ================= USER AUTH ================= */

// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError(400, "User already exists");
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      accessToken: generateAccessToken({
        id: user._id,
        role: "user"
      }),
      refreshToken: generateRefreshToken({
        id: user._id,
        role: "user"
      }),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password required");
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(401, "Invalid credentials");
    }

    res.json({
      success: true,
      accessToken: generateAccessToken({
        id: user._id,
        role: "user"
      }),
      refreshToken: generateRefreshToken({
        id: user._id,
        role: "user"
      }),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

/* ================= ADMIN AUTH ================= */

// @route POST /api/auth/admin/login
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new ApiError(401, "Invalid admin credentials");
    }

    res.json({
      success: true,
      accessToken: generateAccessToken({
        role: "admin"
      }),
      refreshToken: generateRefreshToken({
        role: "admin"
      }),
      admin: {
        email
      }
    });
  } catch (error) {
    next(error);
  }
};
