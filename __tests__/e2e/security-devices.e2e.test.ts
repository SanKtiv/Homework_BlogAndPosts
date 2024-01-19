import {client} from "../../src/repositories/mongodb-repository/db";
import {getRequest} from "./services/test-request";
import {routePaths} from "../../src/setting";
import {userActions} from "./services/users-services";
import {user} from "./utility/users-utility";
import {auth} from "./utility/auth-utility";
import {userSessionActions} from "./services/security-devices-test-services";

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

        const result = await userActions.authUser(user.sendBodyAuth_TRUE())
        const refreshToken = result
            .header['set-cookie']
            .map((el: string) => el.split(';', 1).join())
            .join()
        const result1 = await userSessionActions.getDevicesByRefreshToken(refreshToken)
        console.log(result1.body)

        await expect(result1.statusCode).toBe(200)

    })
})