import express from "express";

import authRoutes from "./auth.route";
import workspaceRoutes from "./workspace.route";
import projectRoutes from "./project.route";
import taskRoutes from "./task.route";
import userRoutes from "./user.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/users", userRoutes);

export default router;
