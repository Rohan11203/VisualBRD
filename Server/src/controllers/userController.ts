import type { Request, Response } from "express";
import generateToken from "../utils/generateToken.js";
// import { AuthRequest } from '../middleware/authMiddleware.js';
import { UserModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { jwt } from "zod";
import type { AuthRequest } from "../auth/index.js";

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = await UserModel.create({ name, email, password });

    if (user) {
      generateToken(res, user._id); // Generate a token and set the cookie
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: "Invalid user data provided" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // We need to explicitly select the password because it's excluded by default in the schema
    const user = await UserModel.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  // The 'protect' middleware already fetched the user and attached it to req.user
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};


export const logoutUser = (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Set the expiry date to the past
  });
  res.status(200).json({ message: "User logged out successfully" });
};
