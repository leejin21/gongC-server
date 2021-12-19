import {Router} from "express";
import homeController from "../controllers/home-controller";
import {verifyToken} from "../middlewares/auth";

const homeRouter = Router();

homeRouter.get("/nickname", verifyToken, homeController.getNickname);

export {homeRouter};
