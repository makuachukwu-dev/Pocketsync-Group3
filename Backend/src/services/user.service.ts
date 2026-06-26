import bcrypt from "bcryptjs";
import { UserRecord } from "../types/auth.types";

export const users = new Map<string, UserRecord>();

export class UserService {
  static async createUser(name: string, email: string, passwordHash: string): Promise<UserRecord> {
    const user: UserRecord = {
      id: `user_${Date.now()}`,
      email,
      name,
      passwordHash,
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
    };
    users.set(user.id, user);
    return user;
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
