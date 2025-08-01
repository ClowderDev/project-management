import express from "express";
import {
  addCommentController,
  addSubTaskController,
  archivedTaskController,
  createTaskController,
  deleteTaskController,
  getActivityByResourceIdController,
  getCommentByTaskIdController,
  getMyTaskController,
  getTaskByIdController,
  updateSubTaskController,
  updateTaskAssigneesController,
  updateTaskDescriptionController,
  updateTaskPriorityController,
  updateTaskStatusController,
  updateTaskTitleController,
  watchTaskController,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.post("/:projectId/create-task", createTaskController);
router.post("/:taskId/add-subtask", addSubTaskController);
router.post("/:taskId/add-comment", addCommentController);
router.post("/:taskId/watch", watchTaskController);
router.post("/:taskId/archived", archivedTaskController);
router.put("/:taskId/update-subtask/:subTaskId", updateSubTaskController);
router.put("/:taskId/description", updateTaskDescriptionController);
router.put("/:taskId/status", updateTaskStatusController);
router.put("/:taskId/assignees", updateTaskAssigneesController);
router.get("/my-tasks", getMyTaskController);
router.put("/:taskId/priority", updateTaskPriorityController);
router.get("/:resourceId/activity", getActivityByResourceIdController);
router.get("/:taskId/comments", getCommentByTaskIdController);
router.get("/:taskId", getTaskByIdController);
router.put("/:taskId/title", updateTaskTitleController);
router.delete("/:taskId", deleteTaskController);

export default router;
