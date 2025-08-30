/*
===============================================================================
  Module: Auth Middleware

  Description:
  Middleware để xác thực người dùng dùng trong các route cần đăng nhập

  Dependencies:
  - express
  - jsonwebtoken
  - user.model
  - env.config
  - http.config
  - app-error
  - error-code.enum
  - jwt

  Usage:
  Apply this middleware to any route that requires authentication.

  Author: ClowderDev
  Created: 2025-07-30
  Updated: N/A
===============================================================================
*/

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Env } from "../config/env.config";
import { HTTPSTATUS } from "../config/http.config";
import UserModel from "../models/user.model";
import { AppError } from "../utils/app-error";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { AccessTokenPayload } from "../utils/jwt";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    //Kiểm tra xem header auth có chứa token hay không
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Access token is required",
        errorCode: ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND,
      });
    }

    // Lấy token từ header bỏ tiền tố "Bearer "
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Access token is required",
        errorCode: ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND,
      });
    }

    //Xác thực token
    let payload: AccessTokenPayload;
    try {
      payload = jwt.verify(token, Env.JWT_SECRET, {
        audience: ["user", "access"], //Chấp nhận cả audience mặc định "user" và "access"
      }) as AccessTokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({
          message: "Access token has expired",
          errorCode: ErrorCodeEnum.AUTH_INVALID_TOKEN,
        });
      }

      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Invalid access token",
        errorCode: ErrorCodeEnum.AUTH_INVALID_TOKEN,
      });
    }

    const user = await UserModel.findById(payload.userId);

    if (!user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not found",
        errorCode: ErrorCodeEnum.AUTH_USER_NOT_FOUND,
      });
    }

    if (!user.isEmailVerified) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Email not verified",
        errorCode: ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS,
      });
    }

    //Gán vào request object để sử dụng trong các controller
    req.user = user as Express.User;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: "Authentication failed",
      errorCode: ErrorCodeEnum.INTERNAL_SERVER_ERROR,
    });
  }
};
