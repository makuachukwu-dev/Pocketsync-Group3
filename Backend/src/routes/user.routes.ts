import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", requireAuth, UserController.getMe);
router.post("/kyc/verify", requireAuth, UserController.verifyKyc);

export default router;
