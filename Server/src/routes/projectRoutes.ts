import { Router } from "express";
import {
  addAnnotationToProject,
  createProject,
  exportProjectAsExcel,
  getProjectByID,
} from "../controllers/projectController.js";
import upload from "../config/multer.js";

export const projectRouter = Router();

projectRouter.get("/:projectId", getProjectByID);
projectRouter.post("/create",upload.single('imageUrl'), createProject);

projectRouter.post("/:projectId/annotations", addAnnotationToProject);

projectRouter.post("/:projectId/export",upload.single("annotatedImage"), exportProjectAsExcel)
