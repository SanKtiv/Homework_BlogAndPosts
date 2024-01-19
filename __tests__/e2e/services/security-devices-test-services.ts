import {getRequest} from './test-request';
import {routePaths} from "../../../src/setting";

export const userSessionActions = {

    getDevicesByRefreshToken: async (refreshToken: string) =>
        getRequest()
            .get(`${routePaths.security}`)
            .set('Cookie', [refreshToken]),

}