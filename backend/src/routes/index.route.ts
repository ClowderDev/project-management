import express from "express";

import authRoutes from "./auth.route";
import workspaceRoutes from "./workspace.route";
import projectRoutes from "./project.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);

export default router;
