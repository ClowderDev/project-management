import express from "express";
import {
  handleResetPasswordController,
  loginController,
  refreshTokenController,
  registerController,
  resetPasswordRequestController,
  verifyEmailController,
} from "../controllers/auth.controller";

const router = express.Router();

// Add a test route to verify auth routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working", timestamp: new Date().toISOString() });
});

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/verify-email", verifyEmailController);
router.get("/refresh-token", refreshTokenController);
router.post("/reset-password-request", resetPasswordRequestController);
router.post("/reset-password", handleResetPasswordController);

export default router;
