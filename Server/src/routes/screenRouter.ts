import { Router } from "express";
import { protect } from "../auth/index.js";
import {
  addAnnotationToScreen,
  addScreenToProject,
  exportScreenAsExcel,
  getScreenById,
  updateAnnotationPosition,
} from "../controllers/screenController.js";
import upload from "../config/multer.js";

export const screenRouter = Router();

screenRouter.get("/:screenId", protect, getScreenById);
screenRouter.post(
  "/project/:projectId",
  protect,
  upload.single("imageUrl"),
  addScreenToProject
);

screenRouter.post("/:screenId/annotations", protect, addAnnotationToScreen);
screenRouter.put(
  "/:screenId/annotations/:annotationId/coordinates",
  updateAnnotationPosition
);

screenRouter.post(
  "/:screenId/export",
  protect,
  upload.single("annotatedImage"),
  exportScreenAsExcel
);
