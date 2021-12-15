"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const concent_1 = require("./concent");
const auth_1 = require("./auth");
const router = (0, express_1.Router)();
/* ROUTE */
router.use("/concent", concent_1.concentRouter);
router.use("/auth", auth_1.authRouter);
exports.default = router;
