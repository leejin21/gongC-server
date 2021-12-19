import {Response, Request} from "express";
import {serviceReturnForm} from "../modules/service-modules";
import {getNicknameService} from "../services/home-services";
import User from "../models/user.model";
// * API DOCS PART

// * CONTROLLER PART
const getNickname = async (req: Request, res: Response) => {
    const user = req.user as User;
    console.log(user.id);
    const returnData: serviceReturnForm = await getNicknameService(user);

    if (returnData.status == 200) {
        // when successed
        const {status, message, responseData} = returnData;
        res.status(status).send({
            status,
            message,
            responseData,
        });
    } else {
        // when failed
        const {status, message} = returnData;
        res.status(status).send({
            status,
            message,
        });
    }
};

export default {
    getNickname: getNickname,
};
