import { Request, Response } from "express";

export class WebController {
  static getHome(_req: Request, res: Response) {
    res.json({
      status: "healthy",
      message: "Auth backend API is running successfully.",
      endpoints: {
        view_docs: "/API_DOCUMENTATION.md"
      },
    });
  }
}
