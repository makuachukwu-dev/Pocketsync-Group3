import { Request, Response } from "express";

export class WebController {
  static getHome(_req: Request, res: Response) {
    res.json({
      status: "healthy",
      message: "Auth backend API is running successfully.",
      endpoints: {
        register: "POST /register",
        login: "POST /login",
        logout: "POST /logout",
        me: "GET /me",
        dashboard: "GET /dashboard",
        googleAuth: "GET /auth/google",
        googleAuthCallback: "GET /auth/google/callback",
        appleAuth: "GET /auth/apple",
        appleAuthCallback: "POST /auth/apple/callback",
        forgotPassword: "POST /forgot-password",
        resetPassword: "POST /reset-password",
      },
    });
  }
}
