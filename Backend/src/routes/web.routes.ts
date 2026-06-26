import { Router } from "express";
import { WebController } from "../controllers/web.controller";

const router = Router();

router.get("/", WebController.getHome);

export default router;
