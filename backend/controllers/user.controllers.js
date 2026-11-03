import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { validateRegisterUser } from "../validators/user.validator.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const generate_Access_and_RefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate access and refresh tokens");
  }
};

const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const validationError = validateRegisterUser(email, name, password, role);

  if (validationError) {
    throw new ApiError(400, validationError);
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser)
    throw new ApiError(409, "User with username or email already exists");

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) throw new ApiError(500, "Failed to create user");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User not found");

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generate_Access_and_RefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, user: loggedInUser },
        "User signed in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User signed out successfully"));
});

// isAuthenticated function to check if the user is authenticated
const isAuthenticated = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).select("-password -refreshToken");
  try {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: req.user, success: true },
          "User is authenticated"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Failed to check authentication");
  }
});

export { signUp, signIn, logout, isAuthenticated };
