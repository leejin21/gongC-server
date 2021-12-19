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
exports.loginService = exports.signUpService = void 0;
const dotenv = __importStar(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUpService = async (email, password, nickname, confirmpw) => {
    const returnForm = {
        status: 500,
        message: "server error",
        responseData: {},
    };
    // * Validate if password equals to confirmpw
    if (confirmpw != password) {
        returnForm.status = 400;
        returnForm.message = "Confirmpw and Password not equal";
        return returnForm;
    }
    // * Validate if email already exists
    let isEmailExist = false;
    await user_model_1.default.findOne({ where: { email: email } })
        .then((data) => {
        if (data) {
            isEmailExist = true;
            returnForm.status = 400;
            returnForm.message = "Email already exist";
        }
    })
        .catch((e) => {
        console.log(e);
        returnForm.status = 500;
        returnForm.message = "Server Error";
        return;
    });
    // * Create User only when email not exists
    if (!isEmailExist) {
        dotenv.config();
        const TOKEN_KEY = process.env.TOKEN_KEY || "";
        // * Encrypt user password
        let encryptedPassword = await bcryptjs_1.default.hash(password, 10);
        const token = jsonwebtoken_1.default.sign({ email }, TOKEN_KEY, {
            expiresIn: "999999h",
        });
        await new user_model_1.default({
            email: email || "",
            password: encryptedPassword || "",
            nickname: nickname || "",
            android_token: token || "",
        })
            .save()
            .then((data) => {
            returnForm.status = 200;
            returnForm.message = "SignUp Success";
            returnForm.responseData = { token: data.android_token };
        })
            .catch((e) => {
            console.log(e);
            returnForm.status = 500;
            returnForm.message = "Server Error";
        });
    }
    return returnForm;
};
exports.signUpService = signUpService;
const loginService = async (email, password) => {
    const returnForm = {
        status: 500,
        message: "server error",
        responseData: {},
    };
    await user_model_1.default.findOne({
        where: {
            email: email,
        },
        attributes: ["id", "password", "android_token"],
    })
        .then(async (data) => {
        // * Validate if email already exists
        if (data) {
            const isPasswordCorrect = await bcryptjs_1.default.compare(password, data.password);
            // * Validate if password is correct
            if (isPasswordCorrect) {
                returnForm.status = 200;
                returnForm.message = "Login Success";
                returnForm.responseData = { token: data.android_token };
            }
            else {
                returnForm.status = 400;
                returnForm.message = "Wrong password";
            }
        }
        else {
            returnForm.status = 400;
            returnForm.message = "Wrong email";
        }
    }, (e) => {
        throw e;
    })
        .catch((e) => {
        console.log(e);
        returnForm.status = 500;
        returnForm.message = "Server Error";
    });
    return returnForm;
};
exports.loginService = loginService;
