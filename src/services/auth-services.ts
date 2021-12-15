import * as dotenv from "dotenv";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { serviceReturnForm } from "../modules/service-modules";

const signUpService = async (
    email: string,
    password: string,
    nickname: string
) => {
    const returnForm: serviceReturnForm = {
        status: 500,
        message: "server error",
        responseData: {},
    };

    // * Validate if email already exists
    let isEmailExist = false;
    await User.findOne({ where: { email: email } })
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
        let encryptedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email }, TOKEN_KEY, {
            expiresIn: "999999h",
        });

        await new User({
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

const loginService = async (email: string, password: string) => {
    const returnForm: serviceReturnForm = {
        status: 500,
        message: "server error",
        responseData: {},
    };

    await User.findOne({
        where: {
            email: email,
        },
        attributes: ["id", "password", "android_token"],
    })
        .then(
            async (data) => {
                // * Validate if email already exists
                if (data) {
                    const isPasswordCorrect = await bcrypt.compare(
                        password,
                        data.password
                    );
                    // * Validate if password is correct
                    if (isPasswordCorrect) {
                        returnForm.status = 200;
                        returnForm.message = "Login Success";
                        returnForm.responseData = { token: data.android_token };
                    } else {
                        returnForm.status = 400;
                        returnForm.message = "Wrong password";
                    }
                } else {
                    returnForm.status = 400;
                    returnForm.message = "Wrong email";
                }
            },
            (e) => {
                throw e;
            }
        )
        .catch((e) => {
            console.log(e);
            returnForm.status = 500;
            returnForm.message = "Server Error";
        });
    return returnForm;
};

export { signUpService, loginService };
