"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeRouter = void 0;
const express_1 = require("express");
const home_controller_1 = __importDefault(require("../controllers/home-controller"));
const auth_1 = require("../middlewares/auth");
const homeRouter = (0, express_1.Router)();
exports.homeRouter = homeRouter;
homeRouter.get("/nickname", auth_1.verifyToken, home_controller_1.default.getNickname);
