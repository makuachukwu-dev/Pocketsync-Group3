import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { requireAuth, requireKyc } from "../middleware/auth.middleware";

const router = Router();

router.get("/institutions", requireAuth, AccountController.getInstitutions);
router.get("/dashboard", requireAuth, AccountController.getDashboardSummary);

router.post("/accounts/connect", requireAuth, requireKyc, AccountController.connectAccount);
router.post("/accounts/:accountId/refresh", requireAuth, requireKyc, AccountController.refreshAccount);
router.delete("/accounts/:accountId", requireAuth, requireKyc, AccountController.disconnectAccount);

export default router;
