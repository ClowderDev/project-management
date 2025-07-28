import { getVerificationEmailTemplate } from "./templates/email.verification.template";
import { sendEmail } from "./mailer";

type VerificationEmailParams = {
  email: string;
  username: string;
  verificationToken: string;
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
