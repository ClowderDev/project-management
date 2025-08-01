import {
  addCommentService,
  addSubTaskService,
  archivedTaskService,
  deleteTaskService,
  getActivityByResourceIdService,
  getCommentByTaskIdService,
  getMyTaskService,
  updateSubTaskService,
  updateTaskPriority,
  watchTaskService,
} from "./../services/task.service";
import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import { createTaskSchema } from "../validation/task.validator";
import {
  createTaskService,
  getTaskByIdService,
  updateTaskAssigneesService,
  updateTaskDescriptionService,
  updateTaskStatusService,
  updateTaskTitleService,
} from "../services/task.service";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const validatedData = createTaskSchema.parse(req.body);
    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const newTask = await createTaskService(projectId, validatedData, userId);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Task created successfully",
      data: newTask,
    });
  }
);

export const getTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const result = await getTaskByIdService(taskId, userId);

    if (!result) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        message: "Task not found",
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      message: "Task retrieved successfully",
      data: {
        tasks: [result.task],
        project: result.project,
      },
    });
  }
);

export const updateTaskTitleController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const result = await updateTaskTitleService(taskId, title, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Task title updated successfully",
      taskId,
      title,
    });
  }
);

export const updateTaskDescriptionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { description } = req.body;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const result = await updateTaskDescriptionService(
      taskId,
      description,
      userId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Task description updated successfully",
      taskId,
      description,
    });
  }
);

export const updateTaskStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const result = await updateTaskStatusService(taskId, status, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Task status updated successfully",
      taskId,
      status,
    });
  }
);

export const updateTaskAssigneesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { assignees } = req.body;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const result = await updateTaskAssigneesService(taskId, assignees, userId);
    return res.status(HTTPSTATUS.OK).json({
      message: "Task assignees updated successfully",
      taskId,
      assignees,
    });
  }
);

export const updateTaskPriorityController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { priority } = req.body;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const updatedTask = await updateTaskPriority(taskId, priority, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Task priority updated successfully",
      taskId,
      priority: updatedTask.priority,
    });
  }
);

export const addSubTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const subTask = await addSubTaskService(taskId, title, userId);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Subtask added successfully",
      subTask,
    });
  }
);

export const updateSubTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId, subTaskId } = req.params;
    const { title, completed } = req.body;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const updatedSubTask = await updateSubTaskService(
      taskId,
      subTaskId,
      completed,
      userId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Subtask updated successfully",
      subTask: updatedSubTask,
    });
  }
);

export const getActivityByResourceIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { resourceId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    // Assuming you have a service to get activities by resource ID
    const activities = await getActivityByResourceIdService(resourceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Activities retrieved successfully",
      activities,
    });
  }
);

export const getCommentByTaskIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    // Assuming you have a service to get comments by task ID
    const comments = await getCommentByTaskIdService(taskId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Comments retrieved successfully",
      comments,
    });
  }
);

export const addCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    // Assuming you have a service to add comments
    const comment = await addCommentService(taskId, text, userId);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Comment added successfully",
      comment,
    });
  }
);

export const watchTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const result = await watchTaskService(taskId, userId);

    return res.status(HTTPSTATUS.OK).json({
      result: result,
    });
  }
);

export const archivedTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    const result = await archivedTaskService(taskId, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Task archived successfully",
      result,
    });
  }
);

export const getMyTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();
    const tasks = await getMyTaskService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  }
);

export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;

    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const userId =
      typeof req.user._id === "string" ? req.user._id : req.user._id.toString();

    await deleteTaskService(taskId, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Task deleted successfully",
      taskId,
    });
  }
);
