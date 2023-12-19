import request from 'supertest'
import {app, routePaths} from "../../src/setting";
import {client} from "../../src/repositories/mongodb-repository/db";
import {postActions} from "./services/posts-services";
import {post} from "./utility/posts-utility";
import {auth} from "./utility/auth-utility";
import {blogActions} from "./services/blogs-services";
import {blogsRepositoryQuery} from "../../src/repositories/mongodb-repository/blogs-mongodb/blogs-mongodb-Query";
import {blog} from "./utility/blogs-utility";
import {ObjectId} from "mongodb";
import {expectErrors} from "./utility/error-utility";

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

    it('-POST /posts, should return status 201 and post', async () => {
        const createBlog = await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)
        const result = await postActions
            .createPost(post.sendBody(post.body_TRUE, createBlog.body.id), auth.basic_TRUE)

        await expect(result.statusCode).toBe(201)
        await expect(result.body)
            .toEqual({...post.expectPost_TRUE(), id: expect.any(String), blogId: createBlog.body.id})
    })

    it('-POST /posts, should return status 400 and errorsMessages', async () => {
        const createBlog = await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)
        const result = await postActions
            .createPost(post.sendBody(post.body_FALSE, createBlog.body.id), auth.basic_TRUE)
        await expect(result.statusCode).toBe(400)
        await expect(result.body).toEqual(expectErrors(post.body_FALSE))
    })

    it('-POST /posts, should return status 401', async () => {
        const createBlog = await blogActions
            .createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)
        const result = await postActions
            .createPost(post.sendBody(post.body_TRUE, createBlog.body.id), auth.basic_FALSE)

        await expect(result.statusCode).toBe(401)
        //await expect(result)
    })

    it('-GET /posts, should return status 200 and paging', async () => {
        await getRequest().delete(routePaths.deleteAllData)
        const createBlog = await blogActions
            .createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)
        const createManyPosts = await postActions
            .createManyPosts(post.sendManyBody(post.body_TRUE, 10, createBlog.body.id), auth.basic_TRUE)
        const result = await postActions.getPostsPaging(post.query(post.paging.preset1))

        console.log(createManyPosts)
        await expect(result.statusCode).toBe(200)
        //await expect(result.body).toEqual()
    })
})