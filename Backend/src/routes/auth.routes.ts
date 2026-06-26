import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import passport from "passport";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

router.get("/auth/google", AuthController.googleAuth);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/?auth=failed" }),
  AuthController.googleAuthCallback
);

router.get("/auth/apple", AuthController.appleAuth);
router.post(
  "/auth/apple/callback",
  passport.authenticate("apple", { failureRedirect: "/?auth=failed" }),
  AuthController.appleAuthCallback
);

export default router;
