import { email } from "./../../../frontend/node_modules/zod/src/v4/core/regexes";
import mongoose from "mongoose";
import { RegisterSchemaType } from "../validation/auth.validator";
import UserModel from "../models/user.model";
import { BadRequestException } from "../utils/app-error";
import { signJwtToken } from "../utils/jwt";
import { Env } from "../config/env.config";
import VerificationModel from "../models/verification.model";
import { HTTPSTATUS } from "../config/http.config";
import { sendVerificationEmail } from "../mailers/email.mailer";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const existingUser = await UserModel.findOne({ email }).session(session);

      if (existingUser) {
        throw new BadRequestException("User already exists with this email");
      }

      const newUser = new UserModel({
        ...body,
      });

      await newUser.save({ session });

      const { token: verificationToken } = signJwtToken(
        { userId: newUser.id },
        {
          secret: Env.JWT_SECRET,
          expiresIn: "1h",
          audience: ["email-verification"],
        }
      );

      await VerificationModel.create({
        userId: newUser.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      let emailSent = false;
      try {
        await sendVerificationEmail({
          email: newUser.email,
          username: newUser.name,
          verificationToken: verificationToken,
        });
        emailSent = true;
      } catch (error) {
        console.error("Failed to send verification email:", error);
        throw new BadRequestException("Failed to send verification email");
      }

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        verificationToken,
      };
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};
