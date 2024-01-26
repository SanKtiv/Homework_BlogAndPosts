import {client} from "../../src/repositories/mongodb-repository/db";
import {getRequest} from "./services/test-request";
import {routePaths} from "../../src/setting";
import {userActions} from "./services/users-services";
import {user} from "./utility/users-utility";
import {auth} from "./utility/auth-utility";
import {setTimeout} from "timers";
import {authActions} from "./services/auth-test-servises";

describe('TEST for AUTH', () => {

    beforeAll(async () => {
        await client.connect()
        await getRequest().delete(routePaths.deleteAllData)
    })

    afterAll(async () => {
        await client.close()
    })

    it('-POST /auth/login, should return status 429 if requests more then five per ten sec', async () => {
        await userActions.createUser(user.sendBody_TRUE(), auth.basic_TRUE)

        const result1 = await userActions.authUser(user.sendBodyAuth_FALSE())
        await expect(result1.statusCode).toBe(401)

        const result2 = await userActions.authUser(user.sendBodyAuth_FALSE())
        await expect(result2.statusCode).toBe(401)

        const result3 = await userActions.authUser(user.sendBodyAuth_FALSE())
        await expect(result3.statusCode).toBe(401)

        const result4 = await userActions.authUser(user.sendBodyAuth_FALSE())
        await expect(result4.statusCode).toBe(401)

        const result5 = await userActions.authUser(user.sendBodyAuth_FALSE())
        await expect(result5.statusCode).toBe(401)

        const result6 = await userActions.authUser(user.sendBodyAuth_FALSE())
        await expect(result6.statusCode).toBe(429)

        await new Promise((resolve, reject) => {
            setTimeout(() => resolve(Date.now()), 10000)
        })
        const resultAfter12sec = await userActions.authUser(user.sendBodyAuth_FALSE())
        await expect(resultAfter12sec.statusCode).toBe(401)
    })

    it('-POST /auth/registration-email-resending, should return status 429 if requests more then five per ten sec, after return status 204', async () => {

        await new Promise((resolve, reject) => {
            setTimeout(() => resolve(Date.now()), 12000)
        })

        const body = user.sendBody_TRUE()
        const result1 = await authActions.registrationEmailResending(body.email)
        await expect(result1.statusCode).toBe(204)
        const result2 = await authActions.registrationEmailResending(body.email)
        await expect(result2.statusCode).toBe(204)
        const result3 = await authActions.registrationEmailResending(body.email)
        await expect(result3.statusCode).toBe(204)
        const result4 = await authActions.registrationEmailResending(body.email)
        await expect(result4.statusCode).toBe(204)
        const result5 = await authActions.registrationEmailResending(body.email)
        await expect(result5.statusCode).toBe(204)
        const result6 = await authActions.registrationEmailResending(body.email)
        await expect(result6.statusCode).toBe(429)

        await new Promise((resolve, reject) => {
            setTimeout(() => resolve(Date.now()), 10000)
        })

        const result = await authActions.registrationEmailResending(body.email)
        await expect(result.statusCode).toBe(204)
    })
})