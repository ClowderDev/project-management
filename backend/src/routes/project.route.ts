import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createProjectController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller";

const router = express.Router();
router.use(authMiddleware);

router.post("/:workspaceId/create-project", createProjectController);
router.get("/:projectId", getProjectController);
router.put("/:projectId", updateProjectController);
router.delete("/:projectId", deleteProjectController);

export default router;
