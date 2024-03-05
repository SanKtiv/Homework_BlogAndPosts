import {getRequest} from "./test-services/test-request";
import {routePaths} from "../../src/setting";
import {client} from "../../src/repositories/mongodb-repository/db";
import {postActions} from "./test-services/test-posts-services";
import {post} from "./test-utility/test-posts-utility";
import {auth} from "./test-utility/test-auth-utility";
import {blogActions} from "./test-services/test-blogs-services";
import {blog} from "./test-utility/test-blogs-utility";
import {expectErrors} from "./test-utility/test-error-utility";
import {userActions} from "./test-services/test-users-services";
import {user} from "./test-utility/test-users-utility";
import {commentAction} from "./test-services/test-comments-services";
import {commentSendBody_TRUE} from "./test-utility/test-comments-utility";
import {authActions} from "./test-services/test-auth-servises";

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

    it('-GET /posts: postId/comments, should return status 200 and post with comments', async () => {

        await getRequest().delete(routePaths.deleteAllData)
        await userActions.createManyUsers(user.sendManyBody(2))
        const accessTokenArray = await userActions.authManyUser(user.sendAuthManyBody(2))

        const accessToken1 = accessTokenArray[0].body.accessToken
        const accessToken2 = accessTokenArray[1].body.accessToken

        const bodyId = (await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)).body.id

        const postId = (await postActions
            .createPost(post.sendBody(post.body_TRUE, bodyId), auth.basic_TRUE)).body.id

        const comment1 = await commentAction
            .createComment(accessToken1, commentSendBody_TRUE, postId)

        const comment2 = await commentAction
            .createComment(accessToken2, commentSendBody_TRUE, postId)

        const updateResult = await commentAction
            .updateCommentLikesStatus(comment1.body.id, accessToken1, 'Like')


        await commentAction
            .updateCommentLikesStatus(comment2.body.id, accessToken2, 'Dislike')

        const viewComment3 = await commentAction.getCommentById(comment1.body.id, accessToken1)

        const result = await postActions
            .getPostWithCommentsByPostIdAndQuery(postId, accessToken1, post.query(post.paging.preset1))
        console.log(result.body)
        console.log('items =', result.body.items)
        console.log('likesInfo1 =', result.body.items[0].likesInfo)
        console.log('likesInfo2 =', result.body.items[1].likesInfo)
        console.log('get comment from db',viewComment3.body)
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

    it('-PUT /:postId/like-status, should return status 204', async () => {

        await getRequest().delete(routePaths.deleteAllData)

        const newBlog = await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)

        const newPost = await postActions
            .createPost(post.sendBody(post.body_TRUE, newBlog.body.id), auth.basic_TRUE)



        await userActions.createManyUsers(user.sendManyBody(3))
        const accessTokenArray = await userActions.authManyUser(user.sendAuthManyBody(3))

        const accessToken1 = accessTokenArray[0].body.accessToken
        const accessToken2 = accessTokenArray[1].body.accessToken
        const accessToken3 = accessTokenArray[2].body.accessToken

        const updatedPost3 = await postActions.getPostByIdAndAccessToken(newPost.body.id, accessToken3)

        const result1 = await postActions
            .updatePostLikeStatusById(newPost.body.id, 'Like', accessToken1)

        // const updatedPost1 = await postActions.getPostByIdAndAccessToken(newPost.body.id, accessToken1)
        // console.log('update №1', updatedPost1.body)
        // console.log('update №1', updatedPost1.body.extendedLikesInfo.newestLikes)

        const result2 = await postActions
            .updatePostLikeStatusById(newPost.body.id, 'Like', accessToken2)

        // const updatedPost2 = await postActions.getPostById(newPost.body.id)
        // console.log('update №2',updatedPost2.body)
        // console.log('update №2',updatedPost2.body.extendedLikesInfo.newestLikes)

        const result3 = await postActions
            .updatePostLikeStatusById(newPost.body.id, 'Dislike', accessToken3)

        // const updatedPost3 = await postActions.getPostByIdAndAccessToken(newPost.body.id, 'accessToken3')
        //console.log('update №3',updatedPost3.body)
        //console.log('update №3',updatedPost3.body.extendedLikesInfo.newestLikes)

        //await expect(result.statusCode).toBe(200)
    })

    it('-GET /posts/:id, should return status 200 and post with like status', async () => {

        // delete all
        await getRequest().delete(routePaths.deleteAllData)

        //create blog
        const newBlog = await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)

        //create post
        const newPost = await postActions
            .createPost(post.sendBody(post.body_TRUE, newBlog.body.id), auth.basic_TRUE)

        //create 5 users and their access tokens
        await userActions.createManyUsers(user.sendManyBody(4))

        const accessTokenArray = await userActions
            .authManyUser(user.sendAuthManyBody(4))

        const accessToken1 = accessTokenArray[0].body.accessToken
        const accessToken2 = accessTokenArray[1].body.accessToken
        const accessToken3 = accessTokenArray[2].body.accessToken
        const accessToken4 = accessTokenArray[3].body.accessToken

        // user1 like and then get post by id
        await postActions
            .updatePostLikeStatusById(newPost.body.id, 'Like', accessToken1)

        await postActions.getPostByIdAndAccessToken(newPost.body.id, accessToken1)

        // user2 like and then get post by id
        await postActions
            .updatePostLikeStatusById(newPost.body.id, 'Like', accessToken2)

        await postActions.getPostByIdAndAccessToken(newPost.body.id, accessToken1)


    })

    it('-GET /posts, should return status 200 and posts paging', async () => {

        await getRequest().delete(routePaths.deleteAllData)

        //create blog
        const newBlog = await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)

        //create 10 posts
        const newPost = await postActions
            .createManyPosts(post.sendManyBody(post.body_TRUE, 10, newBlog.body.id))

        // const postId1 = newPost[0].body.id
        // const postId2 = newPost[1].body.id
        // const postId3 = newPost[2].body.id
        // const postId4 = newPost[3].body.id
        // const postId5 = newPost[4].body.id
        // const postId6 = newPost[5].body.id
        // const postId7 = newPost[6].body.id
        // const postId8 = newPost[7].body.id
        // const postId9 = newPost[8].body.id
        // const postId10 = newPost[9].body.id

        //create 5 users and their access tokens
        await userActions.createManyUsers(user.sendManyBody(5))
        const accessTokenArray = await userActions
            .authManyUser(user.sendAuthManyBody(5))

        const accessToken1 = accessTokenArray[0].body.accessToken
        const accessToken2 = accessTokenArray[1].body.accessToken
        const accessToken3 = accessTokenArray[2].body.accessToken
        const accessToken4 = accessTokenArray[3].body.accessToken
        const accessToken5 = accessTokenArray[4].body.accessToken

        //write users statuses for posts

        for (let postId of newPost) {
            await postActions
                .updatePostLikeStatusById(postId.id, 'Like', accessToken1)
            await postActions
                .updatePostLikeStatusById(postId.id, 'Dislike', accessToken2)
            await postActions
                .updatePostLikeStatusById(postId.id, 'Like', accessToken3)
            await postActions
                .updatePostLikeStatusById(postId.id, 'Dislike', accessToken4)
            await postActions
                .updatePostLikeStatusById(postId.id, 'Like', accessToken5)
        }

        const result1 = await postActions
            .getPostsPagingWithAccessToken(post.query(post.paging.preset1), accessToken2)

        await expect(result1.statusCode).toBe(200)

    })

})