import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import {
  changeUserPasswordService,
  getUserProfileService,
  updateUserProfileService,
} from "../services/user.service";

export const getUserProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const result = await getUserProfileService(userId);

    res.status(HTTPSTATUS.OK).json({
      status: "success",
      data: result,
    });
  }
);

export const updateUserProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const updateData = req.body;

    const updatedUser = await updateUserProfileService(userId, updateData);

    res.status(HTTPSTATUS.OK).json({
      status: "success",
      data: updatedUser,
    });
  }
);

export const changePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const result = await changeUserPasswordService(
      userId,
      currentPassword,
      newPassword,
      confirmPassword
    );

    res.status(HTTPSTATUS.OK).json({
      status: "success",
      message: "Password changed successfully",
      data: result,
    });
  }
);
