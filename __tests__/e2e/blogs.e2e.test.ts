import request from 'supertest'
import {app} from '../../src/setting'
import {client} from "../../src/repositories/mongodb-repository/db";
import {routePaths} from "../../src/setting";
import {userActions} from "./services/users-services";
import {userSendBody_TRUE} from "./utility/users-utility";
import {
    blogSendBody_TRUE,
    expectBlog_TRUE,
    manyBlogSendBody_TRUE, viewModelBlogsDefaultPaging_TRUE,
} from "./utility/blogs-utility";
import {blogActions} from "./services/blogs-services";


const getRequest = () => {
    return request(app)
}

const viewModelQueryIsEmpty = {
    pagesCount: 0,
    page: 1, pageSize: 10,
    totalCount: 0, items: []
}

    const blogOutputModel = {
    id: "string",
    name: "blog name",
    description: "string",
    websiteUrl: "string",
    createdAt: "2023-11-14T09:41:01.385Z",
    isMembership: true

}

describe('TEST for blogs', () => {

    beforeAll(async () => {
        await client.connect()
        //await getRequest().delete(routePaths.deleteAllData)
    })

    beforeEach(async () => {
        await getRequest().delete(routePaths.deleteAllData)
    })

    afterAll(async () => {
        await client.close()
    })

    it('-POST, should return status 201, ', async () => {
        await blogActions.expectCreateBlog(blogSendBody_TRUE, expectBlog_TRUE, 201)
    })

    it('-GET /blogs: id, should return status 200 and blog', async () => {
        const result = await blogActions.createBlog(blogSendBody_TRUE)
        await expect(result.statusCode).toBe(200)
        await expect(result.body).toEqual({...expectBlog_TRUE, id: result.body.id})
    })

    it('-GET /blogs, should return blogs with default paging, status 200', async () => {
        await blogActions.createManyBlogs(manyBlogSendBody_TRUE(10))
        const result = await blogActions.getBlogsPaging()
        console.log('#1', result.body)
        await blogActions.expectGetBlogsPaging(200)
    })

})
