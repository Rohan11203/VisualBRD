import type { Request, Response } from "express";
import fs from "fs";
import ProjectModel from "../models/projectModel.js";
import AnnotationModel from "../models/annotationModel.js";
import { generateBrdExcel } from "../services/excelExportService.js";
import cloudinary from "../config/cloudinary.js";
import type { AuthRequest } from "../auth/index.js";
import ScreenModel from "../models/screenModel.js";

export interface RequestWithFile extends Request {
  file?: any; // 'file' is optional because not every request will have it
}

export const getScreenById = async (req: AuthRequest, res: Response) => {
  try {
    const screen = await ScreenModel.findById(req.params.screenId).populate(
      "annotations"
    );
    if (screen) {
      // Authorization: Find the parent project to verify ownership.
      const project = await ProjectModel.findById(screen.project);
      // @ts-ignore
      if (!project || project.owner.toString() !== req.user!._id.toString()) {
        return res
          .status(401)
          .json({ message: "Not Authorized to access this screen." });
      }
      res.status(200).json(screen);
    } else {
      res.status(404).json({ message: "Screen not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching the screen." });
  }
};

export const addScreenToProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    console.log("Figma Data", req.body);
    // Authorization: Find the project and verify the current user is the owner.
    const project = await ProjectModel.findById(projectId);
    //@ts-ignore
    if (!project || project.owner.toString() !== req.user!._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized for this project" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Image file from Figma is required." });
    }

    // Upload image to Cloudinary and delete the temporary file.
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "visual-brd-projects",
    });
    fs.unlinkSync(req.file.path);

    // Create the new screen document in the database.
    const screen = new ScreenModel({
      name: req.file.originalname.replace(/\.(png|jpg|jpeg)$/, ""), // Use file name as screen name.
      imageUrl: uploadResult.secure_url,
      project: projectId,
    });
    const createdScreen = await screen.save();

    // Add the new screen's ID to the parent project's list of screens.
    //@ts-ignore
    project.screens.push(createdScreen._id);
    await project.save();

    res.status(201).json(createdScreen);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.log(error);
    res.status(500).json({ message: "Server error while adding screen." });
  }
};

export const addAnnotationToScreen = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { screenId } = req.params;
    const screen = await ScreenModel.findById(screenId);

    if (!screen) {
      return res.status(404).json({ message: "Screen not found." });
    }

    // Authorization check for extra security
    const project = await ProjectModel.findById(screen.project);
    //@ts-ignore
    if (!project || project.owner.toString() !== req.user!._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not Authorized to annotate this screen." });
    }

    const newAnnotation = await AnnotationModel.create({
      ...req.body,
      screen: screenId, // Link annotation to the screen.
    });

    screen.annotations.push(newAnnotation._id);
    await screen.save();

    res.status(201).json(newAnnotation);
  } catch (error) {
    res.status(500).json({ message: "Server error while adding annotation." });
  }
};

export const updateAnnotationPosition = async (req: Request, res: Response) => {
  try {
    const annotationId = req.params.annotationId;

    const { x, y } = req.body;

    const updatedAnnotation = await AnnotationModel.findByIdAndUpdate(
      annotationId,
      {
        $set: { x: x, y: y },
      }
    );

    if (!updatedAnnotation) {
      return res.status(404).send("Annotation not found");
    }

    res.status(200).json(updatedAnnotation);
    console.log(`Annotation with id ${annotationId} has updated`);
  } catch (error) {
    res.status(404).send("Annotation not found");
    console.log(`Annotation not found.`);
  }
};

export const exportScreenAsExcel = async (req: AuthRequest, res: Response) => {
  try {
    const { screenId } = req.params;
    const screen = await ScreenModel.findById(screenId).populate("annotations");

    if (!screen) {
      return res.status(404).json({ message: "Screen not found." });
    }

    // Authorization check
    const project = await ProjectModel.findById(screen.project);
    //@ts-ignore

    if (!project || project.owner.toString() !== req.user!._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not Authorized to export this screen." });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Annotated image file is required." });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    fs.unlinkSync(req.file.path);

    // The service now operates on a Screen document.
    const excelBuffer = await generateBrdExcel(screen as any, imageBuffer);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="BRD-${screen.name}.xlsx"`
    );
    res.send(excelBuffer);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Server error during export." });
  }
};
