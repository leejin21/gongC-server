import { Router } from "express";

import { concentRouter } from "./concent";
import { authRouter } from "./auth";

const router = Router();

/* ROUTE */
router.use("/concent", concentRouter);
router.use("/auth", authRouter);

export default router;
