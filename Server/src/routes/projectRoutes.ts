import { Router } from "express";

import upload from "../config/multer.js";
import {
  createProject,
  getProjectById,
  getProjects,
} from "../controllers/projectController.js";
import { protect } from "../auth/index.js";

export const projectRouter = Router();

projectRouter.get("/", protect, getProjects);
projectRouter.get("/:projectId", protect, getProjectById);
projectRouter.post(
  "/create",
  protect,
  upload.single("imageUrl"),
  createProject
);
