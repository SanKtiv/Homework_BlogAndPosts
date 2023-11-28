import {InputUserAuthModelType, InputUserModelType} from "../../../src/types/users-types";
import {routePaths} from "../../../src/setting";
import {getRequest} from "../comments.e2e.test";

export const userActions = {

    createUser: async (userSendBody: InputUserModelType) =>

        getRequest()
            .post(routePaths.users)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(userSendBody),

    authUser: async (userSendAuthBody: InputUserAuthModelType) =>

        getRequest()
            .post(`${routePaths.auth}/login`)
            .send(userSendAuthBody),

}