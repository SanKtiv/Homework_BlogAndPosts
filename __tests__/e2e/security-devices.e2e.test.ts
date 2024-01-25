import {client} from "../../src/repositories/mongodb-repository/db";
import {getRequest} from "./services/test-request";
import {routePaths} from "../../src/setting";
import {userActions} from "./services/users-services";
import {user} from "./utility/users-utility";
import {auth} from "./utility/auth-utility";
import {userSessionActions} from "./services/security-devices-test-services";
import {device} from "./utility/security-devices-test-utility";
import {setTimeout} from "timers";


describe('TEST for SecurityDevices', () => {

    let refreshTokenDevice1: string
    let refreshTokenDevice2: string

    beforeAll(async () => {
        await client.connect()
        await getRequest().delete(routePaths.deleteAllData)
    })

    afterAll(async () => {
        await client.close()
    })

    it('-GET /security/devices, should return status 200 and all devices for current user', async () => {

        await userActions.createUser(user.sendBody_TRUE(), auth.basic_TRUE)

        const refreshTokensDevices = await userActions
            .authUserDevice(user.sendBodyAuth_TRUE(), device.authUserDevices)

        refreshTokenDevice1 = refreshTokensDevices[0]
        refreshTokenDevice2 = refreshTokensDevices[1]
        const resultBefore = await userSessionActions.getDevicesByRefreshToken(refreshTokensDevices[0])

        await expect(resultBefore.statusCode).toBe(200)

        await new Promise((resolve, reject) => {
            setTimeout(() => resolve(Date.now()), 3000)
        })

        refreshTokenDevice1 = await userActions
            .updateRefreshTokenForDevice(refreshTokensDevices[0])

        const resultAfter = await userSessionActions.getDevicesByRefreshToken(refreshTokensDevices[0])

    })

    it('-DELETE /security/devices:deviceId, should return status 204 and remove device by deviceId', async () => {

        const resultBefore = await userSessionActions.getDevicesByRefreshToken(refreshTokenDevice1)

        const result = await userSessionActions
            .deleteDeviceSessionByDeviceId(resultBefore.body[1].deviceId, refreshTokenDevice1)

        const resultAfter = await userSessionActions.getDevicesByRefreshToken(refreshTokenDevice1)

        await expect(result.statusCode).toBe(204)

        const result_2 = await userActions.updateRefreshToken(refreshTokenDevice2)
        console.log(result_2.statusCode)
    })

    it('-DELETE /security/devices, should return status 204 and remove all device exclude current', async () => {

        const resultBefore = await userSessionActions.getDevicesByRefreshToken(refreshTokenDevice1)

        const result = await userSessionActions.deleteAllDevices(refreshTokenDevice1)

        const resultAfter = await userSessionActions.getDevicesByRefreshToken(refreshTokenDevice1)

        await expect(result.statusCode).toBe(204)
    })
})