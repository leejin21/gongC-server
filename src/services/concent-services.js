"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyDataService = exports.postDataService = void 0;
const service_modules_1 = require("../modules/service-modules");
const study_status_time_model_1 = __importDefault(require("../models/study-status-time.model"));
const sequelize_1 = require("sequelize");
const postDataService = async (user, status) => {
    const returnForm = {
        status: 500,
        message: "server error",
        responseData: {},
    };
    // * Create Data
    await new study_status_time_model_1.default({
        userid: user.id,
        status: status,
    })
        .save()
        .then((data) => {
        returnForm.status = 200;
        returnForm.message = "Post Data Success";
    })
        .catch((e) => {
        console.log(e);
        returnForm.status = 500;
        returnForm.message = "Server Error";
    });
    return returnForm;
};
exports.postDataService = postDataService;
const getDailyDataService = async (user) => {
    const returnForm = {
        status: 500,
        message: "server error",
        responseData: {},
    };
    // * Get today data from StudyStatusTime
    let responseData = {
        play: 0.0,
        concent: 0.0,
        total: 0.0,
    };
    await study_status_time_model_1.default.count({
        where: {
            userid: user.id,
            status: "P",
            createdAt: {
                [sequelize_1.Op.gte]: (0, service_modules_1.getYesterday)(),
            },
        },
    })
        .then((result) => {
        if (result) {
            // 1분마다로 제한 주기
            returnForm.status = 200;
            returnForm.message = "Get Data Success: yes data";
            responseData.play = result;
        }
        else {
            returnForm.status = 200;
            returnForm.message = "Get Data Success: no data";
        }
    })
        .catch((e) => {
        console.log(e);
        returnForm.status = 500;
        returnForm.message = "Server Error";
    });
    await study_status_time_model_1.default.count({
        where: {
            userid: user.id,
            status: "C",
            createdAt: {
                [sequelize_1.Op.gte]: (0, service_modules_1.getYesterday)(),
            },
        },
    })
        .then((result) => {
        if (result) {
            // 1분마다로 제한 주기
            returnForm.status = 200;
            returnForm.message = "Get Data Success: yes data";
            responseData.concent = result;
        }
        else {
            returnForm.status = 200;
            returnForm.message = "Get Data Success: no data";
        }
    })
        .catch((e) => {
        console.log(e);
        returnForm.status = 500;
        returnForm.message = "Server Error";
    });
    responseData.total = responseData.concent + responseData.play;
    returnForm.responseData = responseData;
    return returnForm;
};
exports.getDailyDataService = getDailyDataService;
