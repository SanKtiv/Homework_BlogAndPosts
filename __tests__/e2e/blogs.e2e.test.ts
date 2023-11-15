import request from 'supertest'
import {app} from '../../src/setting'
import {client} from "../../src/repositories/mongodb-repository/db";

const getRequest = () => {
    return request(app)
}

const viewModel = {
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

describe('/blogs', () => {

    beforeEach(async () => {
        await client.connect()
        await getRequest().delete('/testing/all-data')
    })

    afterAll(async () => {
        await client.close()
    })

    it('-GET with empty query, should HTTP status equal 200, and return empty array', async () => {
        await getRequest()
            .get('/blogs')
            .expect(200, viewModel)
    })

    it('-POST, should return status 201, ', async () => {
        await getRequest()
            .post('/blog')
            .send(blogInputModel)
            .expect(201, {...blogInputModel, id: })
    })
})
