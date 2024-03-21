import {client} from "../../src/repositories/mongodb-repository/db";
import {getRequest} from "./test-services/test-request";
import {routePaths} from "../../src/setting";
import {userActions} from "./test-services/test-users-services";
import {user} from "./test-utility/test-users-utility";
import {auth} from "./test-utility/test-auth-utility";
import {setTimeout} from "timers";
import {authActions} from "./test-services/test-auth-servises";
import {email} from "./test-utility/test-mail-utility";
import {constants} from "http2";
import {usersQueryRepository} from "../../src/repositories/mongodb-repository/users-mongodb/users-query-mongodb";
import mongoose from "mongoose";

describe('TEST for AUTH', () => {

    beforeAll(async () => {
        const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
        await client.connect()
        await mongoose.connect(mongoURI)
        await getRequest().delete(routePaths.deleteAllData)
    })

    afterAll(async () => {
        await client.close()
        await mongoose.disconnect()
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

    it('-POST /auth/registration, should return status 429 if requests more then five per ten sec', async () => {

        await getRequest().delete(routePaths.deleteAllData)
        await authActions.registrationUser(user.sendBody_TRUE())
        await authActions.registrationUser(user.sendBody_TRUE())
        await authActions.registrationUser(user.sendBody_TRUE())
        await authActions.registrationUser(user.sendBody_TRUE())
        await authActions.registrationUser(user.sendBody_TRUE())
        const result = await authActions.registrationUser(user.sendBody_TRUE())
        await expect(result.statusCode).toBe(429)

        await new Promise((resolve, reject) => {
            setTimeout(() => resolve(Date.now()), 10000)
        })

        const result2 = await authActions.registrationUser({
            login: 'LoginTrue',
            password: 'this.password_TRUE',
            email: 'this@yandex.com'
        })
        console.log(result2.body)
        await expect(result2.statusCode).toBe(204)
    })

    it('-POST /refresh-token, should return status 200 and access token', async () => {

        await getRequest().delete(routePaths.deleteAllData)
        await userActions.createUser(user.sendBody_TRUE(), auth.basic_TRUE)
        const result = await userActions.authUser(user.sendBodyAuth_TRUE())
        const refreshToken = result
            .header['set-cookie']
            .map((el: string) => el.split(';', 1).join())
            .join()

        const result1 = await authActions.updateRefreshToken(refreshToken)
        await expect(result1.statusCode).toBe(200)
    })

    it('-POST /password-recovery, should return status 204 and send recovery code', async () => {
        const result = await authActions.sendRecoveryCode(email.correct)

        await expect(result.statusCode).toBe(204)
    })

    it('-POST /password-recovery, should return status 400 if email incorrect', async () => {
        const result = await authActions.sendRecoveryCode(email.wrong)

        await expect(result.statusCode).toBe(400)
    })

    it('-POST /password-recovery, should return status 429 if count of request more then 5 in 10 sec', async () => {

    })

    it('-POST /new-password, should return status 204 and change password hash', async () => {
        await authActions.sendRecoveryCode(email.correct)
        const result = await authActions.createNewPassword('Qwerty15', '')

        await expect(result.statusCode).toBe(204)
    })

    it('-POST /new-password, should return status 204 and change password hash,' +
        'then should return status 401 if login with old password', async () => {

        //delete all
        await getRequest().delete(routePaths.deleteAllData)

        // create user
        const resultCreateUser = await userActions.createUser(user.sendBody_TRUE(), auth.basic_TRUE)
        await expect(resultCreateUser.statusCode).toBe(constants.HTTP_STATUS_CREATED)

        //send recovery code for change password
        await authActions.sendRecoveryCode((user.sendBody_TRUE()).email)

        //get recovery code
        const userFromDb = await usersQueryRepository
            .getUserByLoginOrEmail((user.sendBody_TRUE()).login)
        console.log('get user from DB=', userFromDb)
        const recoveryCode = userFromDb!.passwordRecovery!.recoveryCode
        console.log('recoveryCode=', recoveryCode)

        //change password and password hash
        const resultNewCreatePassword = await authActions
            .createNewPassword('Qwerty15', recoveryCode)
        await expect(resultNewCreatePassword.statusCode).toBe(204)

        //login with old password, should return 401
        const userFromDbAfter = await usersQueryRepository
            .getUserByLoginOrEmail((user.sendBody_TRUE()).login)
        console.log('get user from DB after=', userFromDbAfter)
        const resultLoginUser = await userActions.authUser(user.sendBodyAuth_TRUE())
        await expect(resultLoginUser.statusCode).toBe(401)

        //login with new password
        const resultNewLoginUser = await userActions
            .authUser({...user.sendBodyAuth_TRUE(), password: 'Qwerty15'})
        await expect(resultNewLoginUser.statusCode).toBe(200)
    })

    it('-POST /new-password, should return status 400 and error', async () => {

    })
})