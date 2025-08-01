import express from "express";
import {
  acceptGenerateInviteController,
  acceptInviteByTokenController,
  createWorkspaceController,
  getAllWorkspacesController,
  getWorkspaceByIdController,
  getWorkspaceProjectsController,
  getWorkspaceStatsController,
  inviteUserToWorkspaceController,
} from "../controllers/workspace.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllWorkspacesController);
router.get("/:workspaceId", getWorkspaceByIdController);
router.get("/:workspaceId/projects", getWorkspaceProjectsController);
router.post("/", createWorkspaceController);
router.get("/:workspaceId/stats", getWorkspaceStatsController);
router.post("/accept-invite-token", acceptInviteByTokenController);
router.post("/:workspaceId/invite-member", inviteUserToWorkspaceController);
router.post(
  "/:workspaceId/accept-generate-invite",
  acceptGenerateInviteController
);

export default router;
