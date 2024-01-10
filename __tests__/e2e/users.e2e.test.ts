import {client} from "../../src/repositories/mongodb-repository/db";
import {getRequest} from "./services/test-request";
import {routePaths} from "../../src/setting";
import {userActions} from "./services/users-services";
import {user} from "./utility/users-utility";
import {auth} from "./utility/auth-utility";

describe('TEST for USERS', () => {

    beforeAll(async () => {
        await client.connect()
        await getRequest().delete(routePaths.deleteAllData)
    })

    afterAll(async () => {
        await client.close()
    })

    it('-POST /users, should return status 201 and user', async () => {

        const result = await userActions.createUser(user.sendBody_TRUE(), auth.basic_TRUE)

        await expect(result.statusCode).toBe(201)
        await expect(result.body).toEqual(user.expectBody_TRUE())
    })

    // it('-POST /users, should return status 400 and errorsMessages', async () => {
    //
    // })
    //
    it('-POST /users, should return status 401', async () => {

        const result = await userActions.createUser(user.sendBody_TRUE(), auth.basic_FALSE)

        await expect(result.statusCode).toBe(401)
    })

    it('-GET /users, should return status 200 and usersPaging', async () => {

        await userActions.createManyUsers(user.sendManyBody(10))

        const result = await userActions.getUsersPaging(user.query(user.paging1), auth.basic_TRUE)

        await expect(result.statusCode).toBe(200)

    })

    // it('-GET /users, should return status 200 and usersPaging with searchLoginTerm', async () => {
    //
    // })
    //
    // it('-GET /users, should return status 200 and usersPaging with searchEmailTerm', async () => {
    //
    // })

    it('-GET /users, should return status 401', async () => {

        const result = await userActions.getUsersPaging(user.query(user.paging1), auth.basic_FALSE)

        await expect(result.statusCode).toBe(401)
    })

    // it('-DELETE /users: id, should return status 204', async () => {
    //
    // })
    //
    // it('-DELETE /users: id, should return status 401', async () => {
    //
    // })
    //
    // it('-DELETE /users: id, should return status 404', async () => {
    //
    // })
})