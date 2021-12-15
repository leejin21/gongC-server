"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_services_1 = require("../services/auth-services");
// * API DOCS PART
/**
 * @swagger
 * definitions:
 *   SignupUsers:
 *     type: "object"
 *     properties:
 *       email:
 *         type: "string"
 *       password:
 *         type: "string"
 *       nickname:
 *         type: "string"
 */
/**
 * @swagger
 * definitions:
 *   LoginUsers:
 *     type: "object"
 *     properties:
 *       email:
 *         type: "string"
 *       password:
 *         type: "string"
 */
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     description: 회원가입
 *     tags: [Post]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "body"
 *       in: "body"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/SignupUsers"
 *     responses:
 *       "200":
 *         description: "회원가입 성공"
 *       "400":
 *         description: "email, password, nickname 없거나 email 이미 존재하는 경우"
 *       "500":
 *         description: "서버 에러"
 *
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: 로그인
 *     tags: [Post]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "body"
 *       in: "body"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/LoginUsers"
 *     responses:
 *       "200":
 *         description: "로그인 성공"
 *       "400":
 *         description: "email, password 없거나 email이나 password가 틀린 경우"
 *       "500":
 *         description: "서버 에러"
 *
 */
// * CONTROLLER PART
const signUp = async (req, res) => {
    // * Validate user input
    if (!req.body.email || !req.body.password || !req.body.nickname) {
        res.status(400).send({
            status: 400,
            message: "email and password and nickname is all required",
        });
        return;
    }
    const { email, password, nickname } = req.body;
    const returnData = await (0, auth_services_1.signUpService)(email, password, nickname);
    if (returnData.status == 200) {
        // when successed
        const { status, message, responseData } = returnData;
        res.status(status).send({
            status,
            message,
            responseData,
        });
    }
    else {
        // when failed
        const { status, message } = returnData;
        res.status(status).send({
            status,
            message,
        });
    }
};
const login = async (req, res) => {
    // * Validate user input
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            status: 400,
            message: "email and password is both required",
        });
        return;
    }
    const { email, password } = req.body;
    const returnData = await (0, auth_services_1.loginService)(email, password);
    if (returnData.status == 200) {
        // when successed
        const { status, message, responseData } = returnData;
        res.status(status).send({
            status,
            message,
            responseData,
        });
    }
    else {
        // when failed
        const { status, message } = returnData;
        res.status(status).send({
            status,
            message,
        });
    }
};
exports.default = {
    signUp: signUp,
    login: login,
};
