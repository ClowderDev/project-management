import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middlerware";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validation/auth.validator";
import { HTTPSTATUS } from "../config/http.config";
import {
  loginService,
  refreshTokenService,
  registerService,
  resetPasswordRequestService,
  resetPasswordService,
  verifyEmailService,
} from "../services/auth.service";
import { Env } from "../config/env.config";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const result = await registerService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User registered successfully",
      data: result,
    });
  }
);

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = verifyEmailSchema.parse(req.body);

    const result = await verifyEmailService(token);

    return res.status(HTTPSTATUS.OK).json({
      message: "Email verified successfully",
      data: result,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);

    const result = await loginService(body);

    //Set refresh token vào cookie
    //Cookie sẽ được gửi kèm theo mỗi request từ client
    res.cookie("refreshToken", result.refreshToken.token, {
      httpOnly: true,
      secure: Env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    //Trả về access token trong response body
    return res.status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken.token,
      },
    });
  }
);

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = refreshTokenSchema.parse(req.cookies.refreshToken);

    const result = await refreshTokenService(refreshToken);

    return res.status(HTTPSTATUS.OK).json({
      message: "Token refreshed successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken.token,
      },
    });
  }
);

export const resetPasswordRequestController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = resetPasswordRequestSchema.parse(req.body);

    const result = await resetPasswordRequestService(email);

    return res.status(HTTPSTATUS.OK).json({
      message: "Password reset request sent successfully",
      data: result,
    });
  }
);

export const handleResetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, newPassword, confirmPassword } = resetPasswordSchema.parse(
      req.body
    );

    const result = await resetPasswordService(
      token,
      newPassword,
      confirmPassword
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Password reset successfully",
      data: result,
    });
  }
);
