import { Env } from "../../config/env.config";

export const getResetPasswordEmailTemplate = (
  username: string,
  resetPasswordToken: string
) => {
  const resetLink = `${Env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
  const currentYear = new Date().getFullYear();

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Reset Your Password</title>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Roboto', Arial, sans-serif; background-color: #f7f7f7;">
      <table cellpadding="0" cellspacing="0" width="100%" style="padding: 20px; background-color: #f7f7f7;">
        <tr>
          <td>
            <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
              <tr>
                <td style="background-color: #f05a28; padding: 20px 30px; color: #ffffff; text-align: center;">
                  <h2 style="margin: 0; font-size: 24px;">Reset Your Password</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 30px;">
                  <p style="font-size: 16px;">Hi <strong>${username}</strong>,</p>
                  <p style="font-size: 16px;">We received a request to reset your password. Click the button below to proceed:</p>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #f05a28; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
                  </p>
                  <p style="font-size: 14px; color: #666; margin-top: 20px;">If the button doesn't work, copy and paste the following link into your browser:</p>
                  <p style="font-size: 14px; color: #007b7f; word-break: break-all;">${resetLink}</p>
                  <p style="font-size: 14px; color: #666;">If you didn't request this, you can ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f0f0f0; text-align: center; padding: 15px; font-size: 12px; color: #999;">
                  &copy; ${currentYear} TaskHub. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  const text = `Hi ${username},

We received a request to reset your password.

Reset your password by clicking the link below:

${resetLink}

If the link above doesn't work, copy and paste it into your browser.

If you didn't request this, you can safely ignore this email.

— TaskHub Team`;

  return { html, text };
};
