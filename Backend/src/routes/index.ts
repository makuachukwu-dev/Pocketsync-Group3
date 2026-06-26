import { Router } from "express";
import webRoutes from "./web.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/", webRoutes);
router.use("/", authRoutes);
router.use("/", userRoutes);

export default router;
