import request from 'supertest'
import {app} from '../../src/setting'
import {client} from "../../src/repositories/mongodb-repository/db";
import {routePaths} from "../../src/setting";
import {blog} from "./utility/blogs-utility";
import {blogActions} from "./services/blogs-services";
import {auth} from "./utility/auth-utility";
import {expectError} from "./utility/error-utility";


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

    it('-POST, should return status 201 and blog', async () => {
        const result = await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)
        await expect(result.statusCode).toBe(201)
        await expect(result.body).toEqual(blog.expectBlog_TRUE())
    })

    it('-POST, should return status 400 and error errorsMessages: [{message: anyString, field: name}]',
        async () => {
        const resBlog = await blogActions
            .createBlog(blog.sendBody_FALSE_NAME_LENGTH(), auth.basic_TRUE)
        await expect(resBlog.statusCode).toBe(400)
        await expect(resBlog.body.errorsMessages).toEqual(expectError('name'))
    })

    it('-POST, should return status 400 and error errorsMessages: [{message: anyString, field: description}]',
        async () => {
            const resBlog = await blogActions
                .createBlog(blog.sendBody_FALSE_DESCRIPTION_NUM(), auth.basic_TRUE)
            await expect(resBlog.statusCode).toBe(400)
            await expect(resBlog.body.errorsMessages).toEqual(expectError('description'))
        })

    it('-POST, should return status 401', async () => {
        const resBlog = await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_FALSE)
        await expect(resBlog.statusCode).toBe(401)
        await expect(resBlog.body).toBeUndefined
    })

    it('-GET /blogs: id, should return status 200 and blog', async () => {
        const resBlog = await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)
        const result = await blogActions.getBlogById(resBlog.body.id)
        await expect(result.statusCode).toBe(200)
        await expect(result.body).toEqual({...blog.expectBlog_TRUE(), id: resBlog.body.id})
    })

    it('-GET /blogs: id, should return status 404', async () => {
        await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)
        const result = await blogActions.getBlogById(blog.id.FALSE_STRING)
        await expect(result.statusCode).toBe(404)
        await expect(result.body).toBeUndefined
    })

    it('-GET /blogs, should return blogs with default paging, status 200', async () => {
        await blogActions.createManyBlogs(blog.manyBlogSendBody_TRUE(14))
        const result = await blogActions.getBlogsPagingDefault()
        const expectBody = await blog.viewModelBlogsPaging_TRUE(14, result.body.items, blog.pagingDefaultSettings)
        await expect(result.statusCode).toBe(200)
        await expect(result.body).toEqual(expectBody)
    })

    it ('-GET /blogs, should return blogs with paging, sortDirection is asc, status 200', async () => {
        await blogActions.createManyBlogs(blog.manyBlogSendBody_TRUE(14))
        const result = await blogActions.getBlogsPaging(blog.pagingSettings)
        const expectBody = await blog.viewModelBlogsPaging_TRUE(14, result.body.items, blog.pagingSettings)
        console.log(result.body)
        console.log(expectBody)
        await expect(result.statusCode).toBe(200)
        await expect(result.body).toEqual(expectBody)
    })

    // it('-GET /blogs, should return blogs with default paging, status 200', async () => {
    //     await blogActions.createManyBlogs(manyBlogSendBody_TRUE(10))
    //     const result = await blogActions.getBlogsPaging()
    //     console.log('#1', result.body)
    //     await blogActions.expectGetBlogsPaging(200)
    // })

})
