import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { generateAccessToken } from "../utils/generateTokens.js";

export const refreshToken = (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new ApiError(401, "Refresh token missing");

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const accessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role
    });

    res.json({ success: true, accessToken });
  } catch {
    next(new ApiError(401, "Invalid refresh token"));
  }
};
