import { Router } from "express";
import webRoutes from "./web.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import accountRoutes from "./account.routes";

const router = Router();

router.use("/", webRoutes);
router.use("/", authRoutes);
router.use("/", userRoutes);
router.use("/", accountRoutes);

export default router;
