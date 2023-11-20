import request from 'supertest'
import {app} from '../../src/setting'
import {client} from "../../src/repositories/mongodb-repository/db";
import {routePaths} from "../../src/setting";

const getRequest = () => {
    return request(app)
}

const viewModelQueryIsEmpty = {
    pagesCount: 0,
    page: 1, pageSize: 10,
    totalCount: 0, items: []
}

const blogInputModel = {
    name: 'blog_name_1',
    description: "description_1",
    websiteUrl: "https://www.website.com"
}

    const blogOutputModel = {
    id: "string",
    name: "blog name",
    description: "string",
    websiteUrl: "string",
    createdAt: "2023-11-14T09:41:01.385Z",
    isMembership: true

}

describe('test for /blogs', () => {

    beforeEach(async () => {
        await client.connect()
        await getRequest().delete('/testing/all-data')
    })

    afterAll(async () => {
        await client.close()
    })

    it('-GET with empty query, should HTTP status equal 200, and return empty array', async () => {
        await getRequest()
            .get(routePaths.blogs)
            .expect(200, viewModelQueryIsEmpty)
    })



    it('-POST, should return status 201, ', async () => {
        await getRequest()
            .post(routePaths.blog)
            .send(blogInputModel)
            .expect(201, {...blogInputModel, id: })
    })
})
