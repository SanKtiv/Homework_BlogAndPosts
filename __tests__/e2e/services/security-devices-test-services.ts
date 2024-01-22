import {getRequest} from './test-request';
import {routePaths} from "../../../src/setting";

export const userSessionActions = {

    getDevicesByRefreshToken: async (refreshToken: string) =>
        getRequest()
            .get(`${routePaths.security}`)
            .set('Cookie', [refreshToken]),

    deleteDeviceSessionByDeviceId: async (deviceId: string, refreshToken: string) =>
        getRequest()
            .delete(`${routePaths.security}/${deviceId}`)
            .set('Cookie', [refreshToken]),

    deleteAllDevices: async (refreshToken: string) =>
        getRequest()
            .delete(`${routePaths.security}`)
            .set('Cookie', [refreshToken]),
}