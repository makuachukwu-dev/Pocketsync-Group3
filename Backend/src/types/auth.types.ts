import type { Request } from "express";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  googleId?: string;
  appleId?: string;
  picture?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
};

export type SessionUser = {
  userId?: string;
};

export type AuthenticatedRequest = Request & {
  user?: UserRecord;
};
