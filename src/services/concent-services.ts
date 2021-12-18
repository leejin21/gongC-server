import User from "../models/user.model";

import {
    getYesterday,
    serviceReturnForm,
    getLastWeekSundayThisTime,
} from "../modules/service-modules";
import StudyStatusTime from "../models/study-status-time.model";

import {Op} from "sequelize";
import StudyStatusDay from "../models/study-status-day.model";

const postDataService = async (user: User, status: string) => {
    const returnForm: serviceReturnForm = {
        status: 500,
        message: "server error",
        responseData: {},
    };
    // * Create Data
    await new StudyStatusTime({
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

const getDailyDataService = async (user: User) => {
    const returnForm: serviceReturnForm = {
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
    await StudyStatusTime.count({
        where: {
            userid: user.id,
            status: "P",
            createdAt: {
                [Op.gte]: getYesterday(),
            },
        },
    })
        .then((result) => {
            if (result) {
                // 1분마다로 제한 주기
                returnForm.status = 200;
                returnForm.message = "Get Data Success: yes data";
                responseData.play = result;
            } else {
                returnForm.status = 200;
                returnForm.message = "Get Data Success: no data";
            }
        })
        .catch((e) => {
            console.log(e);
            returnForm.status = 500;
            returnForm.message = "Server Error";
        });
    await StudyStatusTime.count({
        where: {
            userid: user.id,
            status: "C",
            createdAt: {
                [Op.gte]: getYesterday(),
            },
        },
    })
        .then((result) => {
            if (result) {
                // 1분마다로 제한 주기
                returnForm.status = 200;
                returnForm.message = "Get Data Success: yes data";
                responseData.concent = result;
            } else {
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

const getWeeklyDataService = async (user: User) => {
    const returnForm: serviceReturnForm = {
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
    await StudyStatusDay.findAll({
        order: [["time", "ASC"]],
        where: {
            userid: user.id,
            time: {
                [Op.lt]: new Date(),
                [Op.gt]: getLastWeekSundayThisTime(),
            },
        },
    })
        .then((resultList) => {
            resultList.map((v, i) => {
                responseData.concentValList[i] = v.study_status;
                responseData.playValList[i] = v.play_status;
            });
            responseData.concentTime = responseData.concentValList.reduce(
                (prev, cur) => {
                    return prev + cur;
                }
            );
            responseData.playTime = responseData.playValList.reduce(
                (prev, cur) => {
                    return prev + cur;
                }
            );
        })
        .catch((e) => {
            console.log(e);
            returnForm.status = 500;
            returnForm.message = "Server Error";
        });
    console.log(responseData);
    // * Get today data from StudyStatusTimes and add to responseData
    await StudyStatusTime.count({
        where: {
            userid: user.id,
            status: "P",
            createdAt: {
                [Op.gte]: getYesterday(),
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
            } else {
                responseData.playValList[idx] = 0;
            }
        })
        .catch((e) => {
            console.log(e);
            returnForm.status = 500;
            returnForm.message = "Server Error";
        });
    await StudyStatusTime.count({
        where: {
            userid: user.id,
            status: "C",
            createdAt: {
                [Op.gte]: getYesterday(),
            },
        },
    })
        .then((result) => {
            let idx = new Date().getDay() - 1;
            idx = idx === -1 ? 6 : idx;
            console.log("인덱스", idx);
            if (result) {
                // 1분마다로 제한 주기
                // TODO give week day accurately by refactoring
                console.log(idx);
                responseData.concentValList[idx] = result;
                responseData.concentTime += result;
                console.log(responseData.concentValList);
            } else {
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

export {postDataService, getDailyDataService, getWeeklyDataService};
