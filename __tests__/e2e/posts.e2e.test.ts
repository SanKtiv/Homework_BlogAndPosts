import {getRequest} from "./services/test-request";
import {routePaths} from "../../src/setting";
import {client} from "../../src/repositories/mongodb-repository/db";
import {postActions} from "./services/posts-services";
import {post} from "./utility/posts-utility";
import {auth} from "./utility/auth-utility";
import {blogActions} from "./services/blogs-services";
import {blog} from "./utility/blogs-utility";
import {expectErrors} from "./utility/error-utility";

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
    })

    it('-GET /posts, should return status 200 and paging', async () => {

        await getRequest().delete(routePaths.deleteAllData)

        const createBlog = await blogActions
            .createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)

        const createManyPosts = await postActions
            .createManyPosts(post.sendManyBody(post.body_TRUE, 10, createBlog.body.id))

        const result = await postActions.getPostsPaging(post.query(post.paging.preset1))

        await expect(result.statusCode).toBe(200)
        await expect(result.body)
            .toEqual(post.expectPaging(createManyPosts, post.paging.preset1))
    })

    it('-GET /posts: id, should return status 200 and post', async () => {

        const posts = await postActions.getPostsDefaultPaging()

        const result = await postActions.getPostById(posts.body.items[2].id)

        await expect(result.statusCode).toBe(200)
        await expect(result.body).toEqual(posts.body.items[2])
    })

    it('-GET /posts: id, should return status 404', async () => {

        const result = await postActions.getPostById(post.id)

        await expect(result.statusCode).toBe(404)
        await expect(result.body).toEqual({})
    })

    it('-PUT /posts: id, should return status 204', async () => {

        const blogId = (await blogActions
            .createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)).body.id

        const postBeforeUpdate = (await postActions.getPostsDefaultPaging()).body.items[3]

        const bodyUpdate = post.bodyUpdate(blogId)

        const result = await postActions
            .updatePostById(bodyUpdate, postBeforeUpdate.id, auth.basic_TRUE)

        const postAfterUpdate = (await postActions.getPostsDefaultPaging()).body.items[3]

        const expectPost = {...postBeforeUpdate, ...bodyUpdate}

        await expect(result.statusCode).toBe(204)
        await expect(postAfterUpdate).toEqual(expectPost)
    })

    it('-PUT /posts: id, should return status 400 and errorsMessages', async () => {

        const postBeforeUpdate = (await postActions.getPostsDefaultPaging()).body.items[1]

        const bodyUpdate = post.bodyUpdate(blog.id.FALSE_NUM)

        const result = await postActions
            .updatePostById(bodyUpdate, postBeforeUpdate.id, auth.basic_TRUE)

        const postAfterUpdate = (await postActions.getPostsDefaultPaging()).body.items[1]

        await expect(result.statusCode).toBe(400)
        await expect(result.body).toEqual(expectErrors(bodyUpdate))
        await expect(postBeforeUpdate).toEqual(postAfterUpdate)
    })

    it('-PUT /posts: id, should return status 401', async () => {

        const blogId = (await blogActions.getBlogsPagingDefault()).body.items[0].id

        const postBeforeUpdate = (await postActions.getPostsDefaultPaging()).body.items[2]

        const bodyUpdate = post.bodyUpdate(blogId)

        const result = await postActions
            .updatePostById(bodyUpdate, postBeforeUpdate.id, auth.basic_FALSE)

        const postAfterUpdate = (await postActions.getPostsDefaultPaging()).body.items[2]

        await expect(result.statusCode).toBe(401)
        await expect(result.body).toEqual({})
        await expect(postBeforeUpdate).toEqual(postAfterUpdate)
    })

    it('-PUT /posts: id, should return status 404', async () => {

        const blogId = (await blogActions.getBlogsPagingDefault()).body.items[0].id

        const bodyUpdate = post.bodyUpdate(blogId)

        const result = await postActions
            .updatePostById(bodyUpdate, post.id, auth.basic_TRUE)

        await expect(result.statusCode).toBe(404)
        await expect(result.body).toEqual({})
    })

    it('-DELETE /posts: id, should return status 204', async () => {

        const postId = (await postActions.getPostsDefaultPaging()).body.items[2].id

        const result = await postActions.deletePostById(postId, auth.basic_TRUE)

        const postAfterDelete = (await postActions.getPostById(postId)).body

        await expect(result.statusCode).toBe(204)
        await expect(postAfterDelete).toEqual({})
    })

    it('-DELETE /posts: id, should return status 401', async () => {

        const postId = (await postActions.getPostsDefaultPaging()).body.items[1].id

        const postBeforeDelete = (await postActions.getPostById(postId)).body

        const result = await postActions.deletePostById(postId, auth.basic_FALSE)

        const postAfterDelete = (await postActions.getPostById(postId)).body

        await expect(result.statusCode).toBe(401)
        await expect(postBeforeDelete).toEqual(postAfterDelete)
    })

    it('-DELETE /posts: id, should return status 404', async () => {

        const result = await postActions.deletePostById(post.id, auth.basic_TRUE)

        await expect(result.statusCode).toBe(404)
    })

})