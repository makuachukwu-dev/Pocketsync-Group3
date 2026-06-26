import { Request, Response } from "express";
import { AccountService } from "../services/account.service";
import { AuthenticatedRequest } from "../types/auth.types";

export class AccountController {
  static getInstitutions(_req: Request, res: Response) {
    const institutions = AccountService.getInstitutions();
    return res.json({ institutions });
  }

  static connectAccount(req: Request, res: Response) {
    const userId = ((req as AuthenticatedRequest).user!).id;
    const { institutionId, username, password, agreedToConsent } = req.body as {
      institutionId?: string;
      username?: string;
      password?: string;
      agreedToConsent?: boolean;
    };

    if (!institutionId || !username || !password) {
      return res.status(400).json({ error: "Institution, username, and password are required" });
    }

    if (agreedToConsent !== true) {
      return res.status(400).json({ error: "You must review and agree to the consent permissions" });
    }

    try {
      const newAccount = AccountService.connect(userId, institutionId, username);
      return res.status(201).json({
        message: "Account connected successfully",
        account: newAccount,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Failed to link account" });
    }
  }

  static getDashboardSummary(req: Request, res: Response) {
    const userId = ((req as AuthenticatedRequest).user!).id;
    const accounts = AccountService.getAccounts(userId);
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return res.json({
      totalBalance,
      accountsCount: accounts.length,
      accounts,
    });
  }

  static refreshAccount(req: Request, res: Response) {
    const userId = ((req as AuthenticatedRequest).user!).id;
    const accountId = req.params.accountId as string;

    const account = AccountService.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: "Linked account not found" });
    }

    if (account.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updated = AccountService.refreshAccount(accountId);
    return res.json({
      message: "Account refreshed successfully",
      account: updated,
    });
  }

  static disconnectAccount(req: Request, res: Response) {
    const userId = ((req as AuthenticatedRequest).user!).id;
    const accountId = req.params.accountId as string;

    const account = AccountService.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: "Linked account not found" });
    }

    if (account.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    AccountService.disconnect(accountId);
    return res.json({ message: "Account disconnected successfully" });
  }
}
