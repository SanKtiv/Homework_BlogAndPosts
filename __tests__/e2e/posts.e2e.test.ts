import request from 'supertest'
import {app, routePaths} from "../../src/setting";
import {client} from "../../src/repositories/mongodb-repository/db";

const getRequest = ()=> request(app)

describe('TEST for POSTS', () => {

    beforeAll(async () => {
        await client.connect()
        await getRequest().delete(routePaths.deleteAllData)
    })

    // beforeEach(async () => {
    //     await getRequest().delete(routePaths.deleteAllData)
    // })

    afterAll(async () => {
        await client.close()
    })

    it('', async () => {

    })
})