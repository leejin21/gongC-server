import User from "../models/user.model";

import {serviceReturnForm} from "../modules/service-modules";

const getNicknameService = async (user: User) => {
    const returnForm: serviceReturnForm = {
        status: 500,
        message: "server error",
        responseData: {},
    };
    let responseData = {nickname: ""};
    // * Create Data
    await User.findOne({
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
            } else {
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

export {getNicknameService};
