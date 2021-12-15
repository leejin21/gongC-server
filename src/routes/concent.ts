import { Router } from "express";
import concentController from "../controllers/concent-controller";
import { verifyToken } from "../middlewares/auth";

const concentRouter = Router();

concentRouter.post("/data", verifyToken, concentController.postData);

concentRouter.get("/daily_data", verifyToken, concentController.getDailyData);

concentRouter.get("/weekly_data", verifyToken, concentController.getWeeklyData);

concentRouter.get(
    "/monthly_data",
    verifyToken,
    concentController.getMonthlyData
);

export { concentRouter };
