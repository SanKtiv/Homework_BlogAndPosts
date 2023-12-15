import request from 'supertest'
import {app} from '../../src/setting'
import {client} from "../../src/repositories/mongodb-repository/db";
import {routePaths} from "../../src/setting";
import {blogActions} from "./services/blogs-services";
import {postActions} from "./services/posts-services";
import {userActions} from "./services/users-services";
import {commentAction} from "./services/comments-services";
//import {postSendBody_TRUE} from "./utility/posts-utility";
import {userSendBody_TRUE, userSendAuthBody_TRUE} from "./utility/users-utility";
import {commentSendBody_TRUE, commentCorrect, comment} from "./utility/comments-utility";
import {codesHTTP} from "../../src/utility/constants";
import {auth} from "./utility/auth-utility";


export const getRequest = () => request(app)

describe('TEST for comments', () => {
    beforeAll(async () => {
        await client.connect()
    })

    beforeEach(async () => {
        await getRequest().delete(routePaths.deleteAllData)
    })

    afterAll(async () => {
        await client.close()
    })

    // it(`-GET /comments:id, should return code 200 and comment` , async () => {
    //
    //     await userActions.createUser(userSendBody_TRUE)
    //     const token = await userActions.authUser(userSendAuthBody_TRUE)
    //     const bodyId = await blogActions.createBlog(blogSendBody_TRUE, auth.basic_TRUE)
    //     const postId = await postActions.createPost(postSendBody_TRUE, bodyId.body.id)
    //     const commentId = await commentAction
    //         .createComment(token.body.accessToken, commentSendBody_TRUE, postId.body.id)
    //
    //     await commentAction
    //         .expectGetCommentById_(commentId.body.id, 200, commentCorrect)
    // })
    //
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