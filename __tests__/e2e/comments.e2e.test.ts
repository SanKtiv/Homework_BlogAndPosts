import request from 'supertest'
import {app} from '../../src/setting'
import {client} from "../../src/repositories/mongodb-repository/db";
import {routePaths} from "../../src/setting";
import {CommentType} from "../../src/types/types-comments";
import {InputUserAuthType, InputUserType} from "../../src/types/types-users";

const getRequest = () => {
    return request(app)
}

const user = {
    login_TRUE: 'Qwerty12',
    login_FALSE: 'Qwerty13',
    email_TRUE: 'qwerty@yandex.com',
    password_TRUE: 'Qwerty12',
    password_FALSE: 'Qwerty123'
}

const userSendBody_TRUE = {
    login: user.login_TRUE,
    password: user.password_TRUE,
    email: user.email_TRUE
}

const userSendAuthBody_TRUE = {
    login: user.login_TRUE,
    password: user.password_TRUE
}

const blog = {
    name_TRUE: "blog_name",
    description_TRUE: "Qwerty12",
    websiteUrl_TRUE: "https://someurl.com"
}

const blogSendBody_TRUE = {
    name: blog.name_TRUE,
    description: blog.description_TRUE,
    websiteUrl: blog.websiteUrl_TRUE
}

const post = {
    title_TRUE: "post_title",
    shortDescription_TRUE: "Qwerty",
    content_TRUE: "content",
}

const postSendBody_TRUE = {
    title: post.title_TRUE,
    shortDescription: post.shortDescription_TRUE,
    content: post.content_TRUE,
}

type CommentInputType = {
    content: string
}

const comments = {
    content_TRUE: 'content-content-content',
}

const commentSendBody_TRUE = {
    content: comments.content_TRUE
}

const commentCorrect = {
    id: expect.any(String),
    content: comments.content_TRUE,
    commentatorInfo: {
        userId: expect.any(String),
        userLogin: expect.any(String)
    },
    createdAt: expect.any(String)
}

const commentsResponseModel = {

}

const tokens = {
    incorrect: 'incorrectToken'
}

const userActions = {

    createUser: async (userSendBody: InputUserType) =>

        getRequest()
            .post(routePaths.users)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(userSendBody),

    authUser: async (userSendAuthBody: InputUserAuthType) =>

        getRequest()
            .post(`${routePaths.auth}/login`)
            .send(userSendAuthBody),

}

const blogActions = {

    createBlog: async (blogSendBody) =>
        getRequest()
            .post(`${routePaths.blogs}`)
            .send(blogSendBody)
}

const postActions = {

    createPost: async (postSendBody, blogId) =>
        getRequest()
            .post(`${routePaths.posts}`)
            .send({...postSendBody, blogId: blogId})
}

const commentAction = {

    createComment: async (token: string, bodyComment: CommentInputType, postId: string | null) =>

        getRequest()
            .post(`${routePaths.posts}/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            //.auth(token, {type: 'bearer'})
            .send(bodyComment)
    ,

    getCommentById: async () =>
        getRequest()
            .get(`${routePaths.comments}/id`)
            .send({})
}

describe('TEST for comments', () => {
    beforeAll(async () => {
        await client.connect()
    })

    // beforeEach(async () => {
    //     await getRequest().delete(routePaths.deleteAllData)
    // })

    afterAll(async () => {
        await client.close()
    })

    it(`-GET /comments:id, should return code 200 and ${commentCorrect}` , async () => {

        await userActions.createUser(userSendBody_TRUE)

        const token = await userActions.authUser(userSendAuthBody_TRUE)

        //console.log(token.body.accessToken)

        const bodyId = await blogActions.createBlog(blogSendBody_TRUE)

        //console.log(bodyId.body.id)

        const postId = await postActions.createPost(postSendBody_TRUE, bodyId.body.id)

        //console.log(postId.body.id)

        const commentId = await commentAction
            .createComment(token.body.accessToken, commentSendBody_TRUE, postId.body.id)

        //console.log(commentId.body.id)


        //console.log(count.body, count.statusCode)
    })
})