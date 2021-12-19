import {Router} from "express";

import {concentRouter} from "./concent";
import {authRouter} from "./auth";
import {homeRouter} from "./home";

const router = Router();

/* ROUTE */
router.use("/concent", concentRouter);
router.use("/auth", authRouter);
router.use("/home", homeRouter);

export default router;
