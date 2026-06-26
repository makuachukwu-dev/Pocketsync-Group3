import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import passport from "passport";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

router.get("/auth/google", AuthController.googleAuth);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/?auth=failed" }),
  AuthController.googleAuthCallback
);

export default router;
