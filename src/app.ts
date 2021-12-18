// src/app.ts
import * as dotenv from "dotenv";
import express, {Response, Request, NextFunction} from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import {sequelize} from "./models";
import User from "./models/user.model";
import indexRouter from "./routes";
import {verifyToken} from "./middlewares/auth";

dotenv.config();
// * APP VARIABLES
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
const HOST: string = process.env.HOST || "localhost";
const app: express.Application = express();

// * CORS SETTINGS

var allowCrossDomain = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
};

// * APP CONFIGURATION: middleware
app.use(allowCrossDomain);
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Request occur! ${req.method}, ${req.url}`);
    next();
});

// * SWAGGER API DOCS SETTING
const swaggerOptions = {
    swaggerDefinition: {
        components: {},
        info: {
            title: "GongC API",
            description: "GongC API 문서",
            contact: {
                name: "Jin Lee",
            },
            servers: ["https://localhost:" + PORT.toString()],
            version: "0.0.1",
        },
    },
    apis: [
        __dirname + "/*.js",
        __dirname + "/*.ts",
        __dirname + "/controllers/*.js",
        __dirname + "/controllers/*.ts",
    ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs));

// * ROUTER SETTING
app.use(indexRouter);

// get
app.get("/", (req: Request, res: Response) => {
    res.send("hello express");
});

app.get("/test", verifyToken, (req: Request, res: Response) => {
    // email password nickname rasp_token android_token
    console.log(req.user?.id);
    res.status(200).send({done: true});
    // res.status(400).send({ done: false });
});

// 5000 포트로 서버 실행
app.listen(PORT, async () => {
    console.log(`server on: listening on ${HOST}:${PORT}`);
    // sequelize-db connection test
    await sequelize
        .sync({})
        .then(async () => {
            console.log("seq connection success");
        })
        .catch((e) => {
            console.log("seq ERROR: ", e);
        });
});
