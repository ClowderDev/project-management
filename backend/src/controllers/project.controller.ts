import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import {
  createProjectService,
  getProjectByIdService,
  getProjectTaskService,
} from "../services/project.service";
import { createProjectSchema } from "../validation/project.validator";

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const validatedData = createProjectSchema.parse(req.body);

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const newProject = await createProjectService(
      workspaceId,
      validatedData,
      userId
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Project created successfully",
      data: newProject,
    });
  }
);

export const getProjectDetailsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const project = await getProjectByIdService(projectId, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Project retrieved successfully",
      data: project,
    });
  }
);

export const getProjectTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    try {
      // Get both project and tasks
      const project = await getProjectByIdService(projectId, userId);
      const tasks = await getProjectTaskService(projectId, userId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Project and tasks retrieved successfully",
        data: {
          project,
          tasks,
        },
      });
    } catch (error: any) {
      console.error("Error fetching project tasks:", error);
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: error.message || "Failed to fetch project data",
      });
    }
  }
);
