import {getRequest} from "./test-services/test-request";
import {client} from "../../src/repositories/mongodb-repository/db";
import {routePaths} from "../../src/setting";
import {blogActions} from "./test-services/test-blogs-services";
import {postActions} from "./test-services/test-posts-services";
import {userActions} from "./test-services/test-users-services";
import {commentAction} from "./test-services/test-comments-services";
import {commentSendBody_TRUE, commentCorrect, comment} from "./test-utility/test-comments-utility";
import {auth} from "./test-utility/test-auth-utility";
import {user} from "./test-utility/test-users-utility";
import {blog} from "./test-utility/test-blogs-utility";
import {post} from "./test-utility/test-posts-utility";


describe('TEST for comments', () => {

    beforeAll(async () => {
        await client.connect()
        await getRequest().delete(routePaths.deleteAllData)
    })

    // beforeEach(async () => {
    //
    // })

    afterAll(async () => {
        await client.close()
    })

    let accessToken = ''
    let comment: any = {}

    it(`-GET /comments:id, should return code 200 and comment` , async () => {

        await userActions.createUser(user.sendBody_TRUE(), auth.basic_TRUE)
        const result = await userActions.authUser(user.sendBodyAuth_TRUE())
        accessToken = result.body.accessToken
        const bodyId = (await blogActions.createBlog(blog.sendBody_TRUE(), auth.basic_TRUE)).body.id
        const postId = await postActions
            .createPost(post.sendBody(post.body_TRUE, bodyId), auth.basic_TRUE)
        comment = await commentAction
            .createComment(accessToken, commentSendBody_TRUE, postId.body.id)

        // await commentAction
        //     .expectGetCommentById_(comment.body.id, 200, commentCorrect)
    })

    it(`-PUT /comments:commentId/like-status, should return code 204 and comment` , async () => {

        await userActions.createManyUsers(user.sendManyBody(2))
        const accessTokenArray = await userActions.authManyUser(user.sendAuthManyBody(2))

        const accessToken1 = accessTokenArray[0].body.accessToken
        const accessToken2 = accessTokenArray[1].body.accessToken

        await commentAction
            .updateCommentLikesStatus(comment.body.id, accessToken, 'Like')

        await commentAction
            .updateCommentLikesStatus(comment.body.id, accessToken1, 'None')

        await commentAction
            .updateCommentLikesStatus(comment.body.id, accessToken2, 'Dislike')

        await commentAction
            .updateCommentLikesStatus(comment.body.id, accessToken, 'None')


        const viewComment3 = await commentAction.getCommentById(comment.body.id, accessToken)
        const viewComment31 = await commentAction.getCommentById(comment.body.id, accessToken1)
        const viewComment32 = await commentAction.getCommentById(comment.body.id, accessToken2)
        console.log(viewComment3.body)
        console.log(viewComment31.body)
        console.log(viewComment32.body)
    })

    // it(`-GET /comments:id, should return code 404` , async () => {
    //
    //     await userActions.createUser(userSendBody_TRUE)
    //     const token = await userActions.authUser(userSendAuthBody_TRUE)
    //     const bodyId = await blogActions.createBlog(blogSendBody_TRUE, auth.basic_TRUE)
    //     const postId = await postActions.createPost(postSendBody_TRUE, bodyId.body.id)
    //     await commentAction
    //         .createComment(token.body.accessToken, commentSendBody_TRUE, postId.body.id)
    //
    //     await commentAction
    //         .expectGetCommentById_(comment.id_FALSE, 404, {})
    // })
    //
    // it(`-DELETE /comments:commentId, should return code 204`, async () => {
    //
    //     await userActions.createUser(userSendBody_TRUE)
    //     const token = await userActions.authUser(userSendAuthBody_TRUE)
    //     const bodyId = await blogActions.createBlog(blogSendBody_TRUE, auth.basic_TRUE)
    //     const postId = await postActions.createPost(postSendBody_TRUE, bodyId.body.id)
    //     const commentId = await commentAction
    //         .createComment(token.body.accessToken, commentSendBody_TRUE, postId.body.id)
    //
    //     await commentAction
    //         .expectDeleteCommentById(token.body.accessToken, commentId.body.id, 204)
    // })

})