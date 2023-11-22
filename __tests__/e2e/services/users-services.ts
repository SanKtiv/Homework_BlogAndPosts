import {InputUserAuthType, InputUserType} from "../../../src/types/types-users";
import {routePaths} from "../../../src/setting";
import {getRequest} from "../comments.e2e.test";

export const userActions = {

    createUser: async (userSendBody: InputUserType) =>

        getRequest()
            .post(routePaths.users)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(userSendBody),

    authUser: async (userSendAuthBody: InputUserAuthType) =>

        getRequest()
            .post(`${routePaths.auth}/login`)
            .send(userSendAuthBody),

}