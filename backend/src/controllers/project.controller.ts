import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import {
  createProjectService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} from "../services/project.service";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validation/project.validator";

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

export const getProjectController = asyncHandler(
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

export const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const validatedData = updateProjectSchema.parse(req.body);

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const updatedProject = await updateProjectService(
      projectId,
      validatedData,
      userId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Project updated successfully",
      data: updatedProject,
    });
  }
);

export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const result = await deleteProjectService(projectId, userId);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);
