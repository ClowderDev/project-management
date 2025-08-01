import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  LoginSchemaType,
  RegisterSchemaType,
  VerifyEmailSchemaType,
} from "../validation/auth.validator";
import UserModel from "../models/user.model";
import { BadRequestException } from "../utils/app-error";
import { signJwtToken } from "../utils/jwt";
import { Env } from "../config/env.config";
import VerificationModel from "../models/verification.model";
import { HTTPSTATUS } from "../config/http.config";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../mailers/email.mailer";

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

      try {
        console.log(
          `Attempting to send verification email to: ${newUser.email}`
        );
        const emailResult = await sendVerificationEmail({
          email: newUser.email,
          username: newUser.name,
          verificationToken: verificationToken,
        });
        console.log("Verification email sent successfully:", emailResult);
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

export const verifyEmailService = async (token: string) => {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const payload = jwt.verify(token, Env.JWT_SECRET, {
        audience: "email-verification",
      });

      if (!payload || typeof payload !== "object" || !payload.userId) {
        throw new BadRequestException("Invalid verification token");
      }

      const verification = await VerificationModel.findOne({
        token,
        userId: payload.userId,
      }).session(session);

      if (!verification) {
        throw new BadRequestException("Invalid or expired verification token");
      }

      if (verification.expiresAt < new Date()) {
        throw new BadRequestException("Verification token has expired");
      }

      const user = await UserModel.findById(verification.userId).session(
        session
      );
      if (!user) {
        throw new BadRequestException("User not found");
      }
      if (user.isEmailVerified) {
        throw new BadRequestException("Email is already verified");
      }

      user.isEmailVerified = true;
      await user.save({ session });
      await VerificationModel.deleteOne({ token }).session(session);
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;

  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const user = await UserModel.findOne({ email }).session(session);
      if (!user) {
        throw new BadRequestException("Invalid email or password");
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new BadRequestException("Invalid email or password");
      }

      if (!user.isEmailVerified) {
        const existingVerification = await VerificationModel.findOne({
          userId: user._id,
        });

        if (
          existingVerification &&
          existingVerification.expiresAt > new Date()
        ) {
          throw new BadRequestException(
            "Email not verified. Please check your email for verification link."
          );
        } else {
          await VerificationModel.deleteMany({ userId: user._id });
          // If no existing verification or it has expired, create a new one
          // This will also handle the case where the user has never verified their email
          const { token: verificationToken } = signJwtToken(
            { userId: user.id },
            {
              secret: Env.JWT_SECRET,
              expiresIn: "1h",
              audience: ["email-verification"],
            }
          );

          await VerificationModel.create({
            userId: user.id,
            token: verificationToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          });

          await sendVerificationEmail({
            email: user.email,
            username: user.name,
            verificationToken,
          });

          throw new BadRequestException(
            "Email not verified. A new verification link has been sent to your email."
          );
        }
      }

      const accessToken = signJwtToken(
        { userId: user.id },
        {
          secret: Env.JWT_SECRET,
          expiresIn: "15m",
          audience: ["access"],
        }
      );

      const refreshToken = signJwtToken(
        { userId: user.id },
        {
          secret: Env.JWT_SECRET,
          expiresIn: "7d",
          audience: ["refresh"],
        }
      );

      user.lastLogin = new Date();
      await user.save();

      return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
      };
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const refreshTokenService = async (refreshToken: string) => {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      if (!refreshToken) {
        throw new BadRequestException("Refresh token is required");
      }

      let payload: any;
      try {
        payload = jwt.verify(refreshToken, Env.JWT_SECRET, {
          audience: "refresh",
        });
      } catch (error) {
        throw new BadRequestException("Invalid or expired refresh token");
      }

      const user = await UserModel.findById(payload.userId);
      if (!user) {
        throw new BadRequestException("User not found");
      }

      const newAccessToken = signJwtToken(
        { userId: user.id },
        {
          secret: Env.JWT_SECRET,
          expiresIn: "15m",
          audience: ["access"],
        }
      );

      return {
        accessToken: newAccessToken,
        user: user.omitPassword(),
      };
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const resetPasswordRequestService = async (email: string) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new BadRequestException("User not found with this email");
      }

      if (!user.isEmailVerified) {
        throw new BadRequestException("Email not verified");
      }

      const existingVerification = await VerificationModel.findOne({
        userId: user._id,
      });

      if (existingVerification && existingVerification.expiresAt > new Date()) {
        throw new BadRequestException(
          "A reset password request is already pending. Please check your email."
        );
      } else {
        await VerificationModel.deleteMany({ userId: user._id });
      }

      const { token: resetToken } = signJwtToken(
        { userId: user.id },
        {
          secret: Env.JWT_SECRET,
          expiresIn: "1h",
          audience: ["reset-password"],
        }
      );

      await VerificationModel.create({
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      try {
        await sendResetPasswordEmail({
          email: user.email,
          username: user.name,
          resetToken,
        });
      } catch (error) {
        console.error("Failed to send reset password email:", error);
        throw new BadRequestException("Failed to send reset password email");
      }

      return {
        message:
          "Reset password email sent successfully. Please check your inbox.",
      };
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const resetPasswordService = async (
  token: string,
  newPassword: string,
  confirmPassword: string
) => {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const payload = jwt.verify(token, Env.JWT_SECRET, {
        audience: "reset-password",
      });

      if (!payload || typeof payload !== "object" || !payload.userId) {
        throw new BadRequestException("Invalid reset password token");
      }

      const verification = await VerificationModel.findOne({
        token,
        userId: payload.userId,
      });

      if (!verification) {
        throw new BadRequestException(
          "Invalid or expired reset password token"
        );
      }

      if (verification.expiresAt < new Date()) {
        throw new BadRequestException("Reset password token has expired");
      }

      const user = await UserModel.findById(verification.userId);
      if (!user) {
        throw new BadRequestException("User not found");
      }
      if (newPassword !== confirmPassword) {
        throw new BadRequestException("Passwords do not match");
      }

      user.password = newPassword;
      await user.save();

      await VerificationModel.deleteMany({ userId: verification.userId });

      return {
        message: "Password reset successfully",
        user: user.omitPassword(),
      };
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};
