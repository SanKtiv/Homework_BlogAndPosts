import {InputUserModelType} from "../../../src/types/users-types";
import {getRequest} from "./test-request";
import {routePaths} from "../../../src/setting";

export const authActions = {

    async updateRefreshToken(refreshToken: string) {
        return getRequest()
            .post(`${routePaths.auth}/refresh-token`)
            .set('Cookie', [refreshToken])
    },

    sendRecoveryCode: async (email: string) =>
        getRequest()
            .post(`${routePaths.auth}/password-recovery`)
            .send({email: email}),

    registrationUser: async (registrationBody: InputUserModelType) =>
        getRequest()
            .post(`${routePaths.auth}/registration`)
            .send(registrationBody),

    registrationConfirmation: async (codeFromEmail: string) =>
        getRequest()
            .post(`${routePaths.auth}/registration-confirmation`)
            .send(codeFromEmail),

    registrationEmailResending: async (email: string) =>
        getRequest()
            .post(`${routePaths.auth}/registration-email-resending`)
            .send({email: email}),
}