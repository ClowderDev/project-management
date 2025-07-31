import express from "express";
import {
  createWorkspaceController,
  getAllWorkspacesController,
  getWorkspaceByIdController,
  getWorkspaceProjectsController,
} from "../controllers/workspace.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllWorkspacesController);
router.get("/:workspaceId", getWorkspaceByIdController);
router.get("/:workspaceId/projects", getWorkspaceProjectsController);
router.post("/", createWorkspaceController);

export default router;
