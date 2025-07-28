import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middlerware";
import { loginSchema, registerSchema } from "../validation/auth.validator";
import { HTTPSTATUS } from "../config/http.config";
import { registerService } from "../services/auth.service";

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

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);
  }
);
