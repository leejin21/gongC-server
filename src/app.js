"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const models_1 = require("./models");
const routes_1 = __importDefault(require("./routes"));
const auth_1 = require("./middlewares/auth");
dotenv.config();
// * APP VARIABLES
const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || "localhost";
const app = (0, express_1.default)();
// * CORS SETTINGS
var allowCrossDomain = function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
};
// * APP CONFIGURATION: middleware
app.use(allowCrossDomain);
app.use(express_1.default.json());
app.use((req, res, next) => {
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// * ROUTER SETTING
app.use(routes_1.default);
// get
app.get("/", (req, res) => {
    res.send("hello express");
});
app.get("/test", auth_1.verifyToken, (req, res) => {
    // email password nickname rasp_token android_token
    console.log(req.user?.id);
    res.status(200).send({ done: true });
    // res.status(400).send({ done: false });
});
// 5000 포트로 서버 실행
app.listen(PORT, async () => {
    console.log(`server on: listening on ${HOST}:${PORT}`);
    // sequelize-db connection test
    await models_1.sequelize
        .sync({})
        .then(async () => {
        console.log("seq connection success");
    })
        .catch((e) => {
        console.log("seq ERROR: ", e);
    });
});
