import jwt from "jsonwebtoken";
import type { Response } from "express";
import { Types } from "mongoose";

const generateToken = (res: Response, userId: any) => {
  if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    throw new Error("Server configuration error: Missing JWT_SECRET");
  }

  // Create the token. The payload contains the user's ID.
  // This is how we will identify the user in future requests.
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set the token in a cookie. This is the standard, secure way to handle authentication.
  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie (XSS protection).
    secure: process.env.NODE_ENV !== "development", // Ensures the cookie is only sent over HTTPS in production.
    sameSite: "none", // Provides protection against Cross-Site Request Forgery (CSRF) attacks.
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds to match the token expiry.
  });
};

export default generateToken;
