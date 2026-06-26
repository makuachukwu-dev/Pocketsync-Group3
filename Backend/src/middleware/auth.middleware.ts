import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { AuthenticatedRequest, SessionUser } from "../types/auth.types";

export function getCurrentUser(req: Request) {
  const sessionUser = req.session as typeof req.session & SessionUser;
  if (!sessionUser.userId) {
    return null;
  }

  return UserService.findById(sessionUser.userId);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  (req as AuthenticatedRequest).user = user;
  next();
}

export function requireKyc(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (authReq.user.kycStatus !== "verified") {
    return res.status(403).json({ error: "KYC verification required before linking accounts" });
  }

  next();
}
