import {client} from "../../src/repositories/mongodb-repository/db";
import {getRequest} from "./services/test-request";
import {routePaths} from "../../src/setting";
import {userActions} from "./services/users-services";
import {user} from "./utility/users-utility";
import {auth} from "./utility/auth-utility";
import {userSessionActions} from "./services/security-devices-test-services";
import {device} from "./utility/security-devices-test-utility";

describe('TEST for SecurityDevices', () => {

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

        const result = await userSessionActions.getDevicesByRefreshToken(refreshTokensDevices[0])
        console.log(result.body)

        await expect(result.statusCode).toBe(200)

    })
})