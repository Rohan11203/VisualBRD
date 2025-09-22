import type { Response } from 'express';
import ProjectModel from '../models/projectModel.js';
import type { AuthRequest } from '../auth/index.js';


export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    // Find all projects where the 'owner' field matches the logged-in user's ID.
    const projects = await ProjectModel.find({ owner: req.user!._id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching projects.' });
  }
};


export const getProjectById = async (req: AuthRequest, res: Response) => {
    try {
        // Find the project and populate its 'screens' array with the full screen documents.
        const project = await ProjectModel.findById(req.params.projectId).populate('screens');

        if (project) {
            // --- AUTHORIZATION CHECK ---
            // Ensure the person requesting the project is the actual owner.
            //@ts-ignore
            if (project.owner.toString() !== req.user!._id.toString()) {
                return res.status(401).json({ message: 'Not Authorized to access this project.' });
            }
            res.status(200).json(project);
        } else {
            res.status(404).json({ message: 'Project not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching the project.' });
    }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const project = new ProjectModel({
      name: name || 'Untitled Project',
      owner: req.user!._id, // Assign ownership to the currently logged-in user.
      screens: [],
    });
    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating the project.' });
  }
};

