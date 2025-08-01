import UserModel, { UserDocument } from "../models/user.model";
import { NotFoundException, BadRequestException } from "../utils/app-error";
import { ErrorCodeEnum } from "../enums/error-code.enum";

export const getUserProfileService = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException(
      "User not found",
      ErrorCodeEnum.AUTH_USER_NOT_FOUND
    );
  }

  return user.omitPassword();
};

export const updateUserProfileService = async (
  userId: string,
  updateData: UserDocument
) => {
  const user = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  if (!user) {
    throw new NotFoundException(
      "User not found",
      ErrorCodeEnum.AUTH_USER_NOT_FOUND
    );
  }

  return user.omitPassword();
};

export const changeUserPasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException(
      "User not found",
      ErrorCodeEnum.AUTH_USER_NOT_FOUND
    );
  }

  if (newPassword !== confirmPassword) {
    throw new BadRequestException(
      "New password and confirm password do not match",
      ErrorCodeEnum.VALIDATION_ERROR
    );
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new BadRequestException(
      "Current password is incorrect",
      ErrorCodeEnum.VALIDATION_ERROR
    );
  }

  user.password = newPassword;
  await user.save();

  return user.omitPassword();
};
