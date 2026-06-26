import nodemailer from "nodemailer";
import { config } from "../config/config";

export class MailService {
  private static transporterPromise: Promise<nodemailer.Transporter> | null = null;
  private static transporter: nodemailer.Transporter | null = null;

  private static async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) {
      return this.transporter;
    }
    if (this.transporterPromise) {
      return this.transporterPromise;
    }

    this.transporterPromise = (async () => {
      const { host, port, user, pass, secure } = config.smtp;

      if (host && user && pass) {
        console.log("Configuring custom SMTP mail transporter...");
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          tls: {
            rejectUnauthorized: false,
          },
        });
      } else {
        console.warn("SMTP environment variables are missing; generating a mock/Ethereal mail account for local testing...");
        try {
          const testAccount = await nodemailer.createTestAccount();
          console.log(`Generated Ethereal mail account: ${testAccount.user}`);
          this.transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
        } catch (error) {
          console.error("Failed to generate Ethereal mail account, falling back to console transporter:", error);
          // Console logger fallback
          this.transporter = {
            sendMail: async (mailOptions: any) => {
              console.log("---------------- MOCK EMAIL SENT ----------------");
              console.log(`From: ${mailOptions.from}`);
              console.log(`To: ${mailOptions.to}`);
              console.log(`Subject: ${mailOptions.subject}`);
              console.log(`Text: ${mailOptions.text}`);
              console.log(`HTML: ${mailOptions.html}`);
              console.log("-------------------------------------------------");
              return { messageId: `mock_${Date.now()}` };
            },
          } as unknown as nodemailer.Transporter;
        }
      }
      return this.transporter;
    })();

    return this.transporterPromise;
  }

  static async sendResetPasswordEmail(to: string, resetUrl: string): Promise<void> {
    const transporter = await this.getTransporter();
    const mailOptions = {
      from: config.smtp.from,
      to,
      subject: "Password Reset Request - PocketSync",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
Please click on the following link, or paste this into your browser to complete the process:\n\n
${resetUrl}\n\n
If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333333; text-align: center;">PocketSync Password Reset</h2>
          <p>Hello,</p>
          <p>We received a request to reset the password for your PocketSync account. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>This password reset link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777777; text-align: center;">&copy; ${new Date().getFullYear()} PocketSync. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email dispatched: ${info.messageId}`);
    
    // If it was Ethereal Email, log the preview URL!
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Ethereal Email Preview] Reset password email can be viewed at: ${previewUrl}`);
    }
  }
}
