import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middlerware";
import { workspaceSchema } from "../validation/workspace.validator";
import { HTTPSTATUS } from "../config/http.config";
import {
  createWorkspaceService,
  getAllWorkspacesService,
  getWorkspaceByIdService,
  getWorkspaceProjectsService,
} from "../services/workspace.service";

export const createWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, color } = workspaceSchema.parse(req.body);

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const result = await createWorkspaceService(
      name,
      description,
      color,
      userId
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Workspace created successfully",
      data: result,
    });
  }
);

export const getAllWorkspacesController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const workspaces = await getAllWorkspacesService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspaces retrieved successfully",
      data: workspaces,
    });
  }
);

export const getWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const workspace = await getWorkspaceByIdService(workspaceId);

    if (!workspace) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        message: "Workspace not found",
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace retrieved successfully",
      data: workspace,
    });
  }
);

export const getWorkspaceProjectsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const workspace = await getWorkspaceByIdService(workspaceId);

    if (!workspace) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        message: "Workspace not found",
      });
    }

    const projects = await getWorkspaceProjectsService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Projects retrieved successfully",
      data: {
        workspace,
        projects,
      },
    });
  }
);
