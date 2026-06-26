import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthenticatedRequest, UserRecord } from "../types/auth.types";

export class UserController {
  static getMe(req: Request, res: Response) {
    const user = (req as AuthenticatedRequest).user as UserRecord;
    res.json({ user: UserService.sanitizeUser(user) });
  }

  static getDashboard(req: Request, res: Response) {
    const user = (req as AuthenticatedRequest).user as UserRecord;
    res.json({ message: "Authenticated", user: UserService.sanitizeUser(user) });
  }
}
