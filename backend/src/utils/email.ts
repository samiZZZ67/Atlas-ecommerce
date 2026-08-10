import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendPasswordResetEmail = async (
  to: string,
  resetLink: string
): Promise<void> => {
  if (!config.email.user || !config.email.pass) {
    // Log to console in dev when email is not configured
    console.log(`\n[DEV] Password reset link for ${to}:\n${resetLink}\n`);
    return;
  }

  await transporter.sendMail({
    from: `"ATLAS" <${config.email.user}>`,
    to,
    subject: 'Reset your ATLAS password',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px">
        <h2 style="font-size:24px;margin-bottom:16px">Reset your password</h2>
        <p style="color:#555;margin-bottom:24px">
          Click the link below to reset your password. This link expires in 1 hour.
        </p>
        <a href="${resetLink}"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 28px;text-decoration:none;border-radius:4px">
          Reset Password
        </a>
        <p style="color:#999;font-size:12px;margin-top:32px">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
