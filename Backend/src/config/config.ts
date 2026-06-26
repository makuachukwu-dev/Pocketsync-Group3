import dotenv from "dotenv";
dotenv.config();

if (!process.env.SESSION_SECRET) {
  throw new Error("FATAL: SESSION_SECRET environment variable is missing! The application cannot start without a secure session secret.");
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  sessionSecret: process.env.SESSION_SECRET,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID,
    teamId: process.env.APPLE_TEAM_ID,
    keyId: process.env.APPLE_KEY_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY, // Can be the private key string directly or a file path
    callbackUrl: process.env.APPLE_CALLBACK_URL,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM ?? '"PocketSync Auth" <noreply@pocketsync.com>',
    secure: process.env.SMTP_SECURE === "true",
  },
};
