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
  kycStatus?: "unverified" | "verified";
  bvn?: string;
  nin?: string;
};

export type SessionUser = {
  userId?: string;
};

export type AuthenticatedRequest = Request & {
  user?: UserRecord;
};
