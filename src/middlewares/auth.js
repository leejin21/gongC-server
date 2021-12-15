"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            status: 403,
            message: "A token is required for authentication",
        });
    }
    try {
        const TOKEN_KEY = process.env.TOKEN_KEY || "";
        const { email } = jsonwebtoken_1.default.verify(token, TOKEN_KEY);
        let user;
        await user_model_1.default.findOne({ where: { email: email } })
            .then((data) => {
            user = data;
        })
            .catch((e) => {
            throw e;
        });
        if (user) {
            req.user = user;
            next();
        }
        else {
            return res
                .status(401)
                .send({ status: 401, message: "Invalid token" });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(401).send({ status: 401, message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
