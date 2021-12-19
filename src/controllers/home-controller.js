"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_services_1 = require("../services/home-services");
// * API DOCS PART
// * CONTROLLER PART
const getNickname = async (req, res) => {
    const user = req.user;
    console.log(user.id);
    const returnData = await (0, home_services_1.getNicknameService)(user);
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
    getNickname: getNickname,
};
