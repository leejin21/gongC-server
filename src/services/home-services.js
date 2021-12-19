"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNicknameService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getNicknameService = async (user) => {
    const returnForm = {
        status: 500,
        message: "server error",
        responseData: {},
    };
    let responseData = { nickname: "" };
    // * Create Data
    await user_model_1.default.findOne({
        where: {
            id: user.id,
        },
    })
        .then((data) => {
        if (data) {
            responseData.nickname = data.nickname;
            returnForm.status = 200;
            returnForm.responseData = responseData;
            returnForm.message = "Post Data Success";
        }
        else {
            returnForm.status = 600;
            returnForm.message = "User Data Not Exist";
        }
    })
        .catch((e) => {
        console.log(e);
        returnForm.status = 500;
        returnForm.message = "Server Error";
    });
    return returnForm;
};
exports.getNicknameService = getNicknameService;
