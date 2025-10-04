import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { UserModel, type IUser } from "../models/userModel.js";

// Extend the Express Request type to include our 'user' property
export interface AuthRequest extends Request {
  user?: IUser; // The user document will be attached here
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined.");
    }
    // Verify the token's signature and get the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Find the user by the ID from the token, excluding the password field
    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    req.user = user;

    // If successful, proceed to the actual route controller
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized, token failed validation" });
  }
};
