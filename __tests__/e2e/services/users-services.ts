import {InputUserAuthModelType, InputUserModelType} from "../../../src/types/users-types";
import {routePaths} from "../../../src/setting";
import {getRequest} from './test-request';
import {auth, BasicType} from "../utility/auth-utility";

export const userActions = {

    createUser: async (userSendBody: InputUserModelType, authBasic: BasicType) =>

        getRequest()
            .post(routePaths.users)
            .set(authBasic.type, authBasic.password)
            .send(userSendBody),

    async createManyUsers(sendManyBody: InputUserModelType[]) {

        for (const sendBody of sendManyBody) {
            await this.createUser(sendBody, auth.basic_TRUE)
        }
    },

    getUsersPaging: async (query: string, authBasic: BasicType) =>

        getRequest()
            .get(`${routePaths.users}${query}`)
            .set(authBasic.type, authBasic.password),

    deleteUserById: async (id: string, authBasic: BasicType) =>

        getRequest()
            .delete(`${routePaths.users}/${id}`)
            .set(authBasic.type, authBasic.password),

    authUser: async (userSendAuthBody: InputUserAuthModelType) =>

        getRequest()
            .post(`${routePaths.auth}/login`)
            .send(userSendAuthBody),

}