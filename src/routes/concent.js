"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concentRouter = void 0;
const express_1 = require("express");
const concent_controller_1 = __importDefault(require("../controllers/concent-controller"));
const auth_1 = require("../middlewares/auth");
const concentRouter = (0, express_1.Router)();
exports.concentRouter = concentRouter;
concentRouter.post("/data", auth_1.verifyToken, concent_controller_1.default.postData);
concentRouter.get("/daily_data", auth_1.verifyToken, concent_controller_1.default.getDailyData);
concentRouter.get("/weekly_data", auth_1.verifyToken, concent_controller_1.default.getWeeklyData);
concentRouter.get("/monthly_data", auth_1.verifyToken, concent_controller_1.default.getMonthlyData);
