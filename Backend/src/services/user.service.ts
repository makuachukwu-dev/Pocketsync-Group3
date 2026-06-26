import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserRecord } from "../types/auth.types";

export const users = new Map<string, UserRecord>();

export class UserService {
  static async createUser(name: string, email: string, passwordHash: string): Promise<UserRecord> {
    const user: UserRecord = {
      id: `user_${Date.now()}`,
      email,
      name,
      passwordHash,
      kycStatus: "unverified",
    };
    users.set(user.id, user);
    return user;
  }

  static createOAuthUser(name: string, email: string, googleId: string, picture?: string): UserRecord {
    const user: UserRecord = {
      id: `user_${Date.now()}`,
      email,
      name,
      googleId,
      picture,
      kycStatus: "unverified",
    };
    users.set(user.id, user);
    return user;
  }

  static createAppleUser(name: string, email: string, appleId: string): UserRecord {
    const user: UserRecord = {
      id: `user_${Date.now()}`,
      email,
      name,
      appleId,
      kycStatus: "unverified",
    };
    users.set(user.id, user);
    return user;
  }

  static verifyUserKyc(userId: string, verificationData: { bvn?: string; nin?: string }): UserRecord | null {
    const user = this.findById(userId);
    if (!user) return null;

    return this.updateUser(userId, {
      kycStatus: "verified",
      bvn: verificationData.bvn || user.bvn,
      nin: verificationData.nin || user.nin,
    });
  }

  static findById(id: string): UserRecord | null {
    return users.get(id) ?? null;
  }

  static findByEmail(email: string): UserRecord | null {
    return Array.from(users.values()).find((u) => u.email === email) ?? null;
  }

  static findByGoogleIdOrEmail(googleId: string, email: string): UserRecord | null {
    return Array.from(users.values()).find(
      (user) => user.googleId === googleId || user.email === email
    ) ?? null;
  }

  static findByAppleIdOrEmail(appleId: string, email: string): UserRecord | null {
    return Array.from(users.values()).find(
      (user) => user.appleId === appleId || user.email === email
    ) ?? null;
  }

  static generateResetToken(email: string): { token: string; expires: Date } | null {
    const user = this.findByEmail(email);
    if (!user) return null;

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    this.updateUser(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    return { token, expires };
  }

  static resetPassword(token: string, newPasswordHash: string): boolean {
    const user = Array.from(users.values()).find(
      (u) =>
        u.resetPasswordToken === token &&
        u.resetPasswordExpires &&
        u.resetPasswordExpires.getTime() > Date.now()
    );

    if (!user) return false;

    this.updateUser(user.id, {
      passwordHash: newPasswordHash,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    return true;
  }

  static updateUser(id: string, updates: Partial<UserRecord>): UserRecord | null {
    const user = users.get(id);
    if (!user) return null;
    const updatedUser = { ...user, ...updates };
    users.set(id, updatedUser);
    return updatedUser;
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static sanitizeUser(user: UserRecord) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
