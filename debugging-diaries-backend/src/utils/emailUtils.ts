import EnvConstant from '@constants/envConstants.js';
import * as AuthDTO from '@dtos/authDTO.js';

export default class EmailUtils {
  constructor() {}

  signUp = (user: AuthDTO.AuthPayload, token: string) => {
    const baseUrl = (EnvConstant.BACKEND_URL || EnvConstant.FRONTEND_URL1 || 'https://debugging-diaries.vercel.app').replace(/\/$/, '');
    const confirmLink = `${baseUrl}/api/auth/confirm-email/${token}`;

    const text = `
      Confirm Your Email

      Hi ${user.username},

      Thanks for signing up! Please click the link below to verify your account:

      ${confirmLink}

      If you did not request this, please ignore this email.
      © 2026 Debugging Diaries. All rights reserved.
    `;

    const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Confirmation</title>
        </head>
        <body style="margin:0; padding:0; background-color:#fafafa; font-family:'Open Sans',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafafa; padding:40px 0;">
            <tr>
              <td align="center" valign="middle">
                <table width="400" cellpadding="0" cellspacing="0" border="0"
                  style="background-color:#ffffff; border:1px solid #e8e8e8; border-radius:10px;
                         box-shadow:0 10px 15px -3px rgba(0,0,0,0.15);">
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 24px 0; font-size:24px; font-weight:700;
                                 color:#1a1a1a; text-align:center; font-family:'Open Sans',Arial,sans-serif;">
                        Confirm Your Email
                      </h2>
                      <p style="color:#3d3d3d; line-height:1.6; margin:0;
                                font-family:'Open Sans',Arial,sans-serif; font-size:14px;">
                        Hi <strong style="color:#1a1a1a;">${user.username}</strong>,<br /><br />
                        Thanks for signing up! Please click the button below to verify your account.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
                        <tr>
                          <td align="center">
                            <a href="${confirmLink}"
                              style="display:inline-block; background-color:#86efac; color:#1f4731;
                                     padding:12px 28px; text-decoration:none; border-radius:8px;
                                     font-weight:600; font-size:14px; font-family:'Open Sans',Arial,sans-serif;">
                              Confirm Email
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:24px 0 0 0; font-size:12px; color:#888888;
                                font-family:'Open Sans',Arial,sans-serif; text-align:center;">
                        If you did not request this, please ignore this email.<br />
                        © 2026 Debugging Diaries. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    return { text, html };
  };

  confirmEmail = (user: AuthDTO.AuthPayload) => {
    const frontendUrl = (EnvConstant.FRONTEND_URL1 || 'https://debugging-diaries.vercel.app').replace(/\/$/, '');
    const loginLink = `${frontendUrl}/auth`;

    const text = `
      Welcome to Debugging Diaries

      Hi ${user.username},

      You're all set!
      You can now log in and start using Debugging Diaries.

      Go to Sign In: ${loginLink}

      © 2026 Debugging Diaries. All rights reserved.
    `;

    const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Sign Up Successful</title>
        </head>
        <body style="margin:0; padding:0; background-color:#fafafa; font-family:'Open Sans',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafafa; padding:40px 0;">
            <tr>
              <td align="center" valign="middle">
                <table width="400" cellpadding="0" cellspacing="0" border="0"
                  style="background-color:#ffffff; border:1px solid #e8e8e8; border-radius:10px;
                         box-shadow:0 10px 15px -3px rgba(0,0,0,0.15);">
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 24px 0; font-size:24px; font-weight:700;
                                 color:#1a1a1a; text-align:center; font-family:'Open Sans',Arial,sans-serif;">
                        Welcome to Debugging Diaries
                      </h2>
                      <p style="color:#3d3d3d; line-height:1.6; margin:0;
                                font-family:'Open Sans',Arial,sans-serif; font-size:14px;">
                        Hi <strong style="color:#1a1a1a;">${user.username}</strong>,<br /><br />
                        You're all set!<br />
                        You can now log in and start using Debugging Diaries.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
                        <tr>
                          <td align="center">
                            <a href="${loginLink}"
                              style="display:inline-block; background-color:#86efac; color:#1f4731;
                                     padding:12px 28px; text-decoration:none; border-radius:8px;
                                     font-weight:600; font-size:14px; font-family:'Open Sans',Arial,sans-serif;">
                              Go to Sign In
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:24px 0 0 0; font-size:12px; color:#888888;
                                font-family:'Open Sans',Arial,sans-serif; text-align:center;">
                        © 2026 Debugging Diaries. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    return { text, html };
  };

  sendOtp = (user: AuthDTO.AuthPayload, otp: AuthDTO.Otp, title: string) => {
    const expiresInMs = otp.expires_at.getTime() - otp.created_at.getTime();
    const expiresInMinutes = Math.round(expiresInMs / 1000 / 60);

    const text = `
    ${title}

    Hi ${user.username},

    Use the OTP below to verify your identity
    It expires in ${expiresInMinutes} minutes.

    OTP: ${otp.code}

    If you did not request this, please ignore this email.
    © 2026 Debugging Diaries. All rights reserved.
  `;

    const html = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body style="margin:0; padding:0; background-color:#fafafa; font-family:'Open Sans',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafafa; padding:40px 0;">
          <tr>
            <td align="center" valign="middle">
              <table width="400" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#ffffff; border:1px solid #e8e8e8; border-radius:10px;
                       box-shadow:0 10px 15px -3px rgba(0,0,0,0.15);">
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 24px 0; font-size:24px; font-weight:700;
                               color:#1a1a1a; text-align:center; font-family:'Open Sans',Arial,sans-serif;">
                      ${title}
                    </h2>
                    <p style="color:#3d3d3d; line-height:1.6; margin:0 0 24px 0;
                              font-family:'Open Sans',Arial,sans-serif; font-size:14px;">
                      Hi <strong style="color:#1a1a1a;">${user.username}</strong>,<br /><br />
                      Use the code below to verify your identity.
                      This code expires in <strong>${expiresInMinutes} minutes</strong>.
                    </p>
                    <!-- OTP Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <td align="center">
                          <div style="display:inline-block; background-color:#f0fdf4; border:1.5px dashed #86efac;
                                      border-radius:10px; padding:20px 40px;">
                            <span style="font-size:36px; font-weight:700; letter-spacing:12px;
                                         color:#1f4731; font-family:'Open Sans',Arial,sans-serif;">
                              ${otp.code}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 24px 0; font-size:13px; color:#888888; text-align:center;
                              font-family:'Open Sans',Arial,sans-serif; line-height:1.6;">
                      Do <strong>not</strong> share this code with anyone.<br />
                      It will expire in ${expiresInMinutes} minutes.
                    </p>
                    <p style="margin:0; font-size:12px; color:#888888;
                              font-family:'Open Sans',Arial,sans-serif; text-align:center;">
                      If you did not request this, please ignore this email.<br />
                      © 2026 Debugging Diaries. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;

    return { text, html };
  };
}
