import type { Request, Response } from "express";
import fs from "fs";
import ProjectModel from "../models/projectModel.js";
import AnnotationModel from "../models/annotationModel.js";
import { generateBrdExcel } from "../services/excelExportService.js";

export interface RequestWithFile extends Request {
  file?: any; // 'file' is optional because not every request will have it
}

export const getProjectByID = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    console.log(projectId)
    const project = await ProjectModel.findById(projectId).populate(
      "annotations"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const createProject = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const newProject = await ProjectModel.create({ imageUrl });
    res.status(201).json(newProject);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addAnnotationToProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { marker, componentId, section, interactivity, ...otherFields } =
      req.body;
    // 1. Find the project to ensure it exists before creating an annotation
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. Create the new annotation with all the data from the form
    const newAnnotation = await AnnotationModel.create({
      project: projectId, // Link back to the parent project
      marker,
      componentId,
      section,
      interactivity,
      ...otherFields, // This includes x, y, isRequired, etc.
    });

    // 3. Add the new annotation's ID to the project's 'annotations' array
    project.annotations.push(newAnnotation._id);
    await project.save();

    res.status(201).json(newAnnotation);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const exportProjectAsExcel = async (
  req: RequestWithFile,
  res: Response
) => {
  try {
    const { projectId } = req.params;

    // First, check if Multer successfully processed and attached a file to the request.
    if (!req.file) {
      return res.status(400).json({ message: "An annotated image file is required for the export." });
    }

    // 1. Read the temporary image file that Multer saved into a buffer.
    const imageBuffer = fs.readFileSync(req.file.path);

    // 2. IMPORTANT: Immediately delete the temporary file from the 'uploads/' directory to keep the server clean.
    fs.unlinkSync(req.file.path);

    // 3. Fetch the project data and its associated annotations from the database.
    const project = await ProjectModel.findById(projectId).populate("annotations");

    
    if (!project) {
      return res.status(404).json({ message: "The specified project was not found." });
    }


    // 4. Call the Excel service, passing it the project data and the image buffer to do the heavy lifting.
    //@ts-ignore
    const excelBuffer = await generateBrdExcel(project, imageBuffer);

    // 5. Set the necessary HTTP headers to instruct the browser that this response is a file to be downloaded.
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="BRD-${project._id}.xlsx"`
    );

    // 6. Send the generated Excel file buffer back to the user.
    res.send(excelBuffer);

  } catch (error: any) {
    console.error("An error occurred during the export process:", error);
    // If an error happens after a file was uploaded, try to clean it up.
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "An internal server error occurred during the file export." });
  }
};
