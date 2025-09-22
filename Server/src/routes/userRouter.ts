import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/userController.js";
import { protect } from "../auth/index.js";

export const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

userRouter.get('/profile', protect, getUserProfile);