import User from "../models/user.model";

import {getYesterday, serviceReturnForm} from "../modules/service-modules";
import StudyStatusTime from "../models/study-status-time.model";

import {Op} from "sequelize";

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

export {postDataService, getDailyDataService};
