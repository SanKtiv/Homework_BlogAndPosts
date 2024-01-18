import {client} from "../../src/repositories/mongodb-repository/db";
import {getRequest} from "./services/test-request";
import {routePaths} from "../../src/setting";
import {userActions} from "./services/users-services";
import {user} from "./utility/users-utility";
import {auth} from "./utility/auth-utility";
import {constants} from "http2";

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

        await expect(result.statusCode).toBe(constants.HTTP_STATUS_CREATED)
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

        const allUsers = (await userActions
            .getUsersPaging(user.query(user.pagingAll), auth.basic_TRUE)).body.items

        const result = await userActions.getUsersPaging(user.query(user.paging1), auth.basic_TRUE)

        await expect(result.statusCode).toBe(200)
        await expect(result.body).toEqual(user.expectPaging(allUsers, user.paging1))
    })

    it('-GET /users, should return status 200 and usersPaging with searchLoginTerm and searchEmailTerm', async () => {

        const allUsers = (await userActions
            .getUsersPaging(user.query(user.pagingAll), auth.basic_TRUE)).body.items

        const result = await userActions.getUsersPaging(user.query(user.paging2), auth.basic_TRUE)

        await expect(result.statusCode).toBe(200)
        await expect(result.body).toEqual(user.expectPaging(allUsers, user.paging2))
    })

    // it('-GET /users, should return status 200 and usersPaging with searchEmailTerm', async () => {
    //
    // })

    it('-GET /users, should return status 401', async () => {

        const result = await userActions.getUsersPaging(user.query(user.paging1), auth.basic_FALSE)

        await expect(result.statusCode).toBe(401)
    })

    it('-DELETE /users: id, should return status 204', async () => {

        const usersCountBeforeDel = (await userActions
            .getUsersPaging(user.query(user.pagingAll), auth.basic_TRUE)).body.items.length

        const id = (await userActions
            .getUsersPaging(user.query(user.pagingAll), auth.basic_TRUE)).body.items[3].id

        const result = await userActions.deleteUserById(id, auth.basic_TRUE)

        const usersCountAfterDel = (await userActions
            .getUsersPaging(user.query(user.pagingAll), auth.basic_TRUE)).body.items.length

        await expect(result.statusCode).toBe(204)
        await expect(usersCountBeforeDel).toEqual(usersCountAfterDel + 1)
    })

    it('-DELETE /users: id, should return status 401', async () => {

        const usersCountBeforeDel = (await userActions
            .getUsersPaging(user.query(user.pagingAll), auth.basic_TRUE)).body.items.length

        const id = (await userActions
            .getUsersPaging(user.query(user.pagingAll), auth.basic_TRUE)).body.items[3].id

        const result = await userActions.deleteUserById(id, auth.basic_FALSE)

        const usersCountAfterDel = (await userActions
            .getUsersPaging(user.query(user.pagingAll), auth.basic_TRUE)).body.items.length

        await expect(result.statusCode).toBe(401)
        await expect(usersCountBeforeDel).toEqual(usersCountAfterDel)
    })

    it('-DELETE /users: id, should return status 404', async () => {

        const id = (await userActions
            .getUsersPaging(user.query(user.pagingAll), auth.basic_TRUE)).body.items[3].id

        await userActions.deleteUserById(id, auth.basic_TRUE)
        const result = await userActions.deleteUserById(id, auth.basic_TRUE)

        await expect(result.statusCode).toBe(404)
    })
})