import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createProjectController,
  getProjectDetailsController,
  getProjectTasksController,
} from "../controllers/project.controller";

const router = express.Router();
router.use(authMiddleware);

router.post("/:workspaceId/create-project", createProjectController);
router.get("/:projectId", getProjectDetailsController);
router.get("/:projectId/tasks", getProjectTasksController);

export default router;
