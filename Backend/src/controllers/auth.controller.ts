import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { SessionUser, UserRecord } from "../types/auth.types";
import passport from "passport";
import { googleAuthEnabled } from "../config/passport";

export class AuthController {
  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existing = UserService.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordHash = await UserService.hashPassword(password);
    const user = await UserService.createUser(name, email, passwordHash);

    const sessionUser = req.session as typeof req.session & SessionUser;
    sessionUser.userId = user.id;

    return res.status(201).json({
      message: "Registered successfully",
      user: UserService.sanitizeUser(user),
    });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = UserService.findByEmail(email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await UserService.comparePassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const sessionUser = req.session as typeof req.session & SessionUser;
    sessionUser.userId = user.id;

    return res.json({
      message: "Logged in successfully",
      user: UserService.sanitizeUser(user),
    });
  }

  static googleAuth(req: Request, res: Response, next: NextFunction) {
    if (!googleAuthEnabled) {
      return res.status(503).json({ error: "Google sign-in is not configured yet" });
    }

    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  }

  static googleAuthCallback(req: Request, res: Response) {
    const user = req.user as UserRecord | undefined;
    const sessionUser = req.session as typeof req.session & SessionUser;
    if (user) {
      sessionUser.userId = user.id;
    }

    res.redirect("/dashboard");
  }

  static logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }

      res.json({ message: "Logged out" });
    });
  }
}
