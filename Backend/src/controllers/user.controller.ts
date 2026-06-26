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

  static verifyKyc(req: Request, res: Response) {
    const userId = ((req as AuthenticatedRequest).user as UserRecord).id;
    const { bvn, nin } = req.body as { bvn?: string; nin?: string };

    if (!bvn && !nin) {
      return res.status(400).json({ error: "BVN or NIN is required for verification" });
    }

    const digitRegex = /^\d{11}$/;

    if (bvn && !digitRegex.test(bvn)) {
      return res.status(400).json({ error: "BVN must be exactly 11 digits" });
    }

    if (nin && !digitRegex.test(nin)) {
      return res.status(400).json({ error: "NIN must be exactly 11 digits" });
    }

    const updatedUser = UserService.verifyUserKyc(userId, { bvn, nin });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "KYC verification successful",
      user: UserService.sanitizeUser(updatedUser),
    });
  }
}
