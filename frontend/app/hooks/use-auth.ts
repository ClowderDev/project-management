/*
===============================================================================
  Module: Auth Hooks

  Description:
  This module provides custom hooks for authentication-related operations.

  Dependencies:
  - @tanstack/react-query
  - ./auth-context

  Usage:
  How to use this module

  Author: ClowderDev
  Created: 2025-07-29
  Updated: N/A
===============================================================================
*/

import { useMutation } from "@tanstack/react-query";
import { postData } from "~/lib/fetch-util";
import type {
  ForgotPasswordSchemaType,
  ResetPasswordSchemaType,
  SignInSchemaType,
  SignUpSchemaType,
  VerifyEmailSchemaType,
} from "~/lib/schema";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: SignUpSchemaType) => postData("/auth/register", data),
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailSchemaType) =>
      postData("/auth/verify-email", data),
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: SignInSchemaType) => postData("/auth/login", data),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordSchemaType) =>
      postData("/auth/reset-password-request", data),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordSchemaType) =>
      postData("/auth/reset-password", data),
  });
};
