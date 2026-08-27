const nodemailer = require("nodemailer");
const { email } = require("../config/env.config");
const User = require("../Auth/models/user.model");

class EmailService {
  static async #sendmail({ to, subject, html }) {
    const transpoter = nodemailer.createTransport({
      host: email.host,
      port: email.port,
      auth: {
        user: email.user,
        pass: email.password,
      },
    });

    const mailOptions = {
      from: `Email Verication  App ${email.from}`,
      to,
      subject,
      html,
    };

    await transpoter.sendMail(mailOptions);
  }

  static async sendVerificationEmail({ name, email, token }) {
    const emailVerifyLink = `http://localhost:3000/api/v1/auth/verify-email/${token}`;
    await this.#sendmail({
      to: email,
      subject: "Verify Email Address",
      html: `

             <h2>Hello ${name}!</h2>
            <p>Thanks for registering. Please verify your email by clicking the link below:</p>
            <a href="${emailVerifyLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
                Verify Email
            </a>
            <p>This link expires in 24 hours.</p>
            <p>If you didn't register, ignore this email.</p>
            `,
    });
  }

  static async resendVerificationEmail({ email }) {
    const user = await User.findOne({
      email,
      isVerified: false,
    });

    if (!user) throw new Error("Email is already Verifed! you can login!");

    if (
      user.emailVerifactionToken &&
      user.emailVerifactionExpiresIn > Date.now()
    ) {
      throw new Error("please check your inbox , link expires in 30 minutes");
    }

    const name = user.name;
    const token = await user.generateEmailVerifactionToken();

    await this.sendVerificationEmail({ name, email, token });
  }

  static async verifyUserEmail(token) {
    const user = await User.findOne({
      emailVerifactionToken: token,
      emailVerifactionExpiresIn: { $gt: Date.now() },
    });

    if (!user) throw new Error("invalid or expired email vrifcation token ");
    user.isVerified = true;
    user.emailVerifactionToken = undefined;
    user.emailVerifactionExpiresIn = undefined;
    await user.save();
  }

  static async sendPasswordLinkEmail({ name, email, token }) {
    const resetLink = `http://localhost:3000/api/v1/auth/reset-password/${token}`;
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 30px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #333333;">
          
          <!-- Header -->
          <h2 style="color: #1a73e8; font-size: 24px; margin-top: 0; margin-bottom: 15px; font-weight: 600;">
            Hello ${name},
          </h2>
          
          <!-- Body Text -->
          <p style="font-size: 16px; line-height: 1.6; color: #5f6368; margin-bottom: 25px;">
            We received a request to reset your password. Click the secure button below to choose a new password and regain access to your account.
          </p>
          
          <!-- Call to Action Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" style="background-color: #1a73e8; color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 16px; font-weight: 500; border-radius: 6px; display: inline-block; box-shadow: 0 2px 5px rgba(26,115,232,0.3); transition: background-color 0.2s;">
              Reset Your Password
            </a>
          </div>
          
          <!-- Warning/Expiry Notice -->
          <p style="font-size: 13px; color: #d93025; background-color: #fce8e6; padding: 10px 15px; border-radius: 6px; display: inline-block; margin-bottom: 25px; font-weight: 500;">
            ⚠️ This link will automatically expire in 5 minutes.
          </p>
          
          <!-- Footer Note -->
          <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 20px;" />
          <p style="font-size: 13px; line-height: 1.5; color: #9aa0a6; margin-bottom: 0;">
            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
          
        </div>
      `;
      const subject='password reset Link'

      await this.#sendmail({to:email, subject, html });
  }
}

module.exports = EmailService;
