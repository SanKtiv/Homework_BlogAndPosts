import {getRequest} from "./services/test-request";
import {client} from "../../src/repositories/mongodb-repository/db";
import {routePaths} from "../../src/setting";
import {blog} from "./utility/blogs-utility";
import {blogActions} from "./services/blogs-services";
import {auth} from "./utility/auth-utility";
import {expectError} from "./utility/error-utility";
import {postActions} from "./services/posts-services";
import {post} from "./utility/posts-utility";

describe('TEST for BLOGS', () => {

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

        const countBlogsBeforeCreate = (await blogActions.getBlogsPagingDefault()).body.items.length

        const result = await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)

        const countBlogsAfterCreate = (await blogActions.getBlogsPagingDefault()).body.items.length

        await expect(result.statusCode).toBe(201)
        await expect(countBlogsBeforeCreate).toEqual(0)
        await expect(countBlogsAfterCreate).toEqual(1)
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
        await blogActions.createManyBlogs(blog.manySendBody(14))
        const result = await blogActions.getBlogsPagingDefault()
        const expectBody = await blog
            .viewModelBlogsPaging_TRUE(14, result.body.items, blog.pagingDefaultSettings)
        await expect(result.statusCode).toBe(200)
        await expect(result.body).toEqual(expectBody)
    })

    it ('-GET /blogs, should return blogs with paging, sortDirection is asc, status 200', async () => {
        await blogActions.createManyBlogs(blog.manySendBody(10))
        const resultDefault = await blogActions.getBlogsPaging(blog.queryPresets(blog.pagingDefaultSettings))

        const result = await blogActions.getBlogsPaging(blog.queryPresets(blog.pagingSettings))
        const expectBody = await blog
            .viewModelBlogsPaging_TRUE(10, resultDefault.body.items, blog.pagingSettings)
        await expect(result.statusCode).toBe(200)
        await expect(result.body).toEqual(expectBody)
    })

    it('-GET /blogs: blogId/posts, should return status 200 and all posts for specified blog', async () => {

        const blogId = (await blogActions
            .createManyBlogs(blog.manySendBody(10)))[4].id

        const posts = await postActions
            .createManyPosts(post.sendManyBody(post.body_TRUE, 10, blogId))

        const result = await postActions
            .getPostsByBlogIdPaging(post.query(post.paging.preset1), blogId)

        await expect(result.statusCode).toBe(200)
        await expect(result.body).toEqual(post.expectPaging(posts, post.paging.preset1))
    })

    it('-GET /blogs: blogId/posts, should return status 404', async () => {

        const result = await postActions
            .getPostsByBlogIdPaging(post.query(post.paging.preset1), blog.id.FALSE)

        await expect(result.statusCode).toBe(404)
        await expect(result.body).toEqual({})
    })

    // it('-POST /blogs: blogId/posts, should return status 201 and post', async () => {
    //
    // })
    //
    // it('-POST /blogs: blogId/posts, should return status 400', async () => {
    //
    // })
    //
    // it('-POST /blogs: blogId/posts, should return status 401', async () => {
    //
    // })
    //
    // it('-POST /blogs: blogId/posts, should return status 404', async () => {
    //
    // })

    it('-PUT /blogs: id, should return status 204', async () => {

        await blogActions.createManyBlogs(blog.manySendBody(10))
        const resultDefault = await blogActions
            .getBlogsPaging(blog.queryPresets(blog.pagingDefaultSettings))
        const result = await blogActions
            .updateBlogById(resultDefault.body.items[3].id, blog.sendBody_TRUE(), auth.basic_TRUE)
        const changedBlog = await blogActions.getBlogById(resultDefault.body.items[3].id)

        await expect(result.statusCode).toBe(204)
        await expect(changedBlog.body).toEqual(blog.expectBlog_TRUE())
    })

    it('-PUT /blogs: id, should return status 400 and errorMessage', async () => {
        await blogActions.createManyBlogs(blog.manySendBody(10))
        const resultDefault = await blogActions.getBlogsPagingDefault()
        const result = await blogActions
            .updateBlogById(resultDefault.body.items[3].id, blog.sendBody_FALSE_NAME_LENGTH(), auth.basic_TRUE)

        await expect(result.statusCode).toBe(400)
        await expect(result.body.errorsMessages).toEqual(expectError('name'))
    })

    it('-PUT /blogs: id, should return status 401', async () => {
        const createdBlog = await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)
        const result = await blogActions
            .updateBlogById(createdBlog.body.id, blog.sendBody_TRUE(), auth.basic_FALSE)
        await expect(result.statusCode).toBe(401)
    })

    it('-PUT /blogs: id, should return status 404', async () => {
        await blogActions.createManyBlogs(blog.manySendBody(10))
        const result = await blogActions
            .updateBlogById(blog.id.FALSE, blog.sendBody_TRUE(), auth.basic_TRUE)

        await expect(result.statusCode).toBe(404)
    })

    it('-DELETE /blogs: id, should return status 204', async () => {
        await blogActions.createManyBlogs(blog.manySendBody(10))
        const resultDefault = await blogActions.getBlogsPagingDefault()
        const blogByIdBefore = await blogActions.getBlogById(resultDefault.body.items[0].id)
        const result = await blogActions
            .deleteBlogById(resultDefault.body.items[0].id, auth.basic_TRUE)
        const blogByIdAfter = await blogActions.getBlogById(resultDefault.body.items[0].id)

        await expect(result.statusCode).toBe(204)
        await expect(blogByIdBefore.body.id).toEqual(resultDefault.body.items[0].id)
        await expect(blogByIdAfter.body.id).toBeUndefined()
    })

    it('-DELETE /blogs: id, should return status 401', async () => {
        await blogActions.createManyBlogs(blog.manySendBody(10))
        const resultDefault = await blogActions.getBlogsPagingDefault()
        const blogByIdBefore = await blogActions.getBlogById(resultDefault.body.items[0].id)
        const result = await blogActions
            .deleteBlogById(resultDefault.body.items[0].id, auth.basic_FALSE)
        const blogByIdAfter = await blogActions.getBlogById(resultDefault.body.items[0].id)

        await expect(result.statusCode).toBe(401)
        await expect(blogByIdBefore.body.id).toEqual(resultDefault.body.items[0].id)
        await expect(blogByIdAfter.body.id).toEqual(resultDefault.body.items[0].id)
    })

    it('-DELETE /blogs: id, should return status 404', async () => {
        await blogActions.createManyBlogs(blog.manySendBody(10))
        const resultDefault = await blogActions.getBlogsPagingDefault()
        const result = await blogActions
            .deleteBlogById(blog.id.FALSE, auth.basic_TRUE)
        const resultDefaultAfter = await blogActions.getBlogsPagingDefault()

        await expect(result.statusCode).toBe(404)
        await expect(resultDefault.body.items).toEqual(resultDefaultAfter.body.items)

    })
})
