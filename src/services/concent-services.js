"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyDataService = exports.getDailyDataService = exports.postDataService = void 0;
const service_modules_1 = require("../modules/service-modules");
const study_status_time_model_1 = __importDefault(require("../models/study-status-time.model"));
const sequelize_1 = require("sequelize");
const study_status_day_model_1 = __importDefault(require("../models/study-status-day.model"));
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
const getWeeklyDataService = async (user) => {
    const returnForm = {
        status: 500,
        message: "server error",
        responseData: {},
    };
    let responseData = {
        concentValList: [0, 0, 0, 0, 0, 0, 0],
        playValList: [0, 0, 0, 0, 0, 0, 0],
        concentTime: 0,
        playTime: 0,
        totalTime: 0,
    };
    // * Get weekly data from StudyStatusDays except for today
    await study_status_day_model_1.default.findAll({
        order: [["time", "ASC"]],
        where: {
            userid: user.id,
            time: {
                [sequelize_1.Op.lt]: new Date(),
                [sequelize_1.Op.gt]: (0, service_modules_1.getLastWeekSundayThisTime)(),
            },
        },
    })
        .then((resultList) => {
        resultList.map((v, i) => {
            let idx = new Date(v.time).getDay() - 1;
            // console.log(idx);
            responseData.concentValList[idx] = v.study_status;
            responseData.playValList[idx] = v.play_status;
        });
        responseData.concentTime = responseData.concentValList.reduce((prev, cur) => {
            return prev + cur;
        });
        responseData.playTime = responseData.playValList.reduce((prev, cur) => {
            return prev + cur;
        });
    })
        .catch((e) => {
        console.log(e);
        returnForm.status = 500;
        returnForm.message = "Server Error";
    });
    console.log(responseData);
    // * Get today data from StudyStatusTimes and add to responseData
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
        let idx = new Date().getDay() - 1;
        idx = idx === -1 ? 6 : idx;
        if (result) {
            // 1분마다로 제한 주기
            responseData.playValList[idx] = result;
            responseData.playTime += result;
        }
        else {
            responseData.playValList[idx] = 0;
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
        let idx = new Date().getDay() - 1;
        idx = idx === -1 ? 6 : idx;
        console.log("인덱스", idx);
        if (result) {
            // 1분마다로 제한 주기
            console.log(idx);
            responseData.concentValList[idx] = result;
            responseData.concentTime += result;
            console.log(responseData.concentValList);
        }
        else {
            responseData.concentValList[idx] = 0;
        }
        responseData.totalTime =
            responseData.concentTime + responseData.playTime;
        returnForm.status = 200;
        returnForm.message = "Get Data Success";
        returnForm.responseData = responseData;
    })
        .catch((e) => {
        console.log(e);
        returnForm.status = 500;
        returnForm.message = "Server Error";
    });
    return returnForm;
};
exports.getWeeklyDataService = getWeeklyDataService;
