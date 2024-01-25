import {client} from "../../src/repositories/mongodb-repository/db";
import {getRequest} from "./services/test-request";
import {routePaths} from "../../src/setting";
import {userActions} from "./services/users-services";
import {user} from "./utility/users-utility";
import {auth} from "./utility/auth-utility";
import {apiRequestService} from "../../src/services/count-request-service";

describe('TEST for SecurityDevices', () => {

    beforeAll(async () => {
        await client.connect()
        await getRequest().delete(routePaths.deleteAllData)
    })

    afterAll(async () => {
        await client.close()
    })

    it('-POST /auth/login, should return status 429 if requests more then five per ten sec', async () => {
        await userActions.createUser(user.sendBody_TRUE(), auth.basic_TRUE)
        const result = await userActions.authFiveUsers(user.sendBodyAuth_TRUE())
        const countRequests = await apiRequestService.getAllApiRequestsByUri()
        await expect(result.statusCode).toBe(429)
    })
})