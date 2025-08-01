import express from "express";
import {
  changePasswordController,
  getUserProfileController,
  updateUserProfileController,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getUserProfileController);
router.put("/profile", updateUserProfileController);
router.put("/change-password", changePasswordController);

export default router;
