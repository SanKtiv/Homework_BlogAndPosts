import {InputUserAuthModelType, InputUserModelType} from "../../../src/types/users-types";
import {BasicType} from "../test-utility/test-auth-utility";
import {getRequest} from "./test-request";
import {routePaths} from "../../../src/setting";

export const authActions = {

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