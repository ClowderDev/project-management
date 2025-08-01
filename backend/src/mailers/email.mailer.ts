import { getVerificationEmailTemplate } from "./templates/email.verification.template";
import { sendEmail } from "./mailer";
import { getResetPasswordEmailTemplate } from "./templates/password.reset.template";
import { getWorkspaceInviteEmailTemplate } from "./templates/invite.member.template";

type VerificationEmailParams = {
  email: string;
  username: string;
  verificationToken: string;
};

type ResetPasswordEmailParams = {
  email: string;
  username: string;
  resetToken: string;
};

type WorkspaceInviteEmailParams = {
  email: string;
  inviteeName: string;
  inviterName: string;
  workspaceName: string;
  inviteToken: string;
};

export const sendVerificationEmail = async (
  params: VerificationEmailParams
) => {
  const { email, username, verificationToken } = params;
  const { html, text } = getVerificationEmailTemplate(
    username,
    verificationToken
  );

  return sendEmail({
    to: email,
    subject: "Verify your email",
    html,
    text,
  });
};

export const sendResetPasswordEmail = async (
  params: ResetPasswordEmailParams
) => {
  const { email, username, resetToken } = params;
  const { html, text } = getResetPasswordEmailTemplate(username, resetToken);

  return sendEmail({
    to: email,
    subject: "Reset your password",
    html,
    text,
  });
};

export const sendWorkspaceInviteEmail = async (
  params: WorkspaceInviteEmailParams
) => {
  const { email, inviteeName, inviterName, workspaceName, inviteToken } =
    params;
  const { html, text } = getWorkspaceInviteEmailTemplate(
    inviteeName,
    inviterName,
    workspaceName,
    inviteToken
  );

  return sendEmail({
    to: email,
    subject: `You're invited to join ${workspaceName}`,
    html,
    text,
  });
};
