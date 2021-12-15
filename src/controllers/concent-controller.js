"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const concent_services_1 = require("../services/concent-services");
// * API DOCS PART
/**
 * @swagger
 * definitions:
 *   PostData:
 *     type: "object"
 *     properties:
 *       status:
 *         type: "string"
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     ResponseForm:
 *       properties:
 *         status:
 *           type: "integer"
 *         message:
 *           type: "string"
 */
/**
 * @swagger
 * /concent/data:
 *   post:
 *     description: 공부 데이터 삽입
 *     tags: [Post]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "body"
 *       in: "body"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/PostData"
 *     responses:
 *       "200":
 *         description: "공부 데이터 삽입 성공"
 *         schema:
 *           $ref: '#/components/schemas/ResponseForm'
 *       "400":
 *         description: "data field 중 status가 없는 경우"
 *         schema:
 *           $ref: '#/components/schemas/ResponseForm'
 *       "401":
 *         description: "토큰이 유효하지 않은 경우"
 *         schema:
 *           $ref: '#/components/schemas/ResponseForm'
 *       "403":
 *         description: "토큰이 헤더의 x-access-token에 없는 경우"
 *         schema:
 *           $ref: '#/components/schemas/ResponseForm'
 *       "500":
 *         description: "서버 에러"
 *         schema:
 *           $ref: '#/components/schemas/ResponseForm'
 *
 */
/**
 * @swagger
 * /concent/daily_data:
 *   get:
 *     description: 일일 공부 데이터 조회
 *     tags: [Get]
 *     produces:
 *     - "application/json"
 *     responses:
 *       "200":
 *         description: "공부 데이터 조회 성공"
 *         schema:
 *           type: "object"
 *           properties:
 *             status:
 *               type: "integer"
 *             message:
 *               type: "string"
 *             responseData:
 *               type: "object"
 *               properties:
 *                 concent:
 *                   type: "integer"
 *                 play:
 *                   type: "integer"
 *                 total:
 *                   type: "integer"
 *       "401":
 *         description: "토큰이 유효하지 않은 경우"
 *         schema:
 *           $ref: '#/components/schemas/ResponseForm'
 *       "403":
 *         description: "토큰이 헤더의 x-access-token에 없는 경우"
 *         schema:
 *           $ref: '#/components/schemas/ResponseForm'
 *       "500":
 *         description: "서버 에러"
 *         schema:
 *           $ref: '#/components/schemas/ResponseForm'
 */
// * CONTROLLER PART
const postData = async (req, res) => {
    // * Validate user input
    if (!req.body.status) {
        res.status(400).send({
            status: 400,
            message: "data field status missing",
        });
    }
    const { status } = req.body;
    const user = req.user;
    const returnData = await (0, concent_services_1.postDataService)(user, status);
    res.status(returnData.status).send({
        status: returnData.status,
        message: returnData.message,
    });
};
const getDailyData = async (req, res) => {
    const user = req.user;
    const returnData = await (0, concent_services_1.getDailyDataService)(user);
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
const getWeeklyData = async (req, res) => { };
const getMonthlyData = async (req, res) => { };
exports.default = {
    postData: postData,
    getDailyData: getDailyData,
    getWeeklyData: getWeeklyData,
    getMonthlyData: getMonthlyData,
};
