import {routePaths} from "../../../src/setting";
import {getRequest} from './test-request'
import {auth, BasicType} from "../utility/auth-utility";

export const postActions = {

    createPost: async (postSendBody: any, authBasic: BasicType) =>
        getRequest()
            .post(`${routePaths.posts}`)
            .set(authBasic.type, authBasic.password)
            .send(postSendBody),

    getPostById: async (id: string) =>
        getRequest()
            .get(`${routePaths.posts}/${id}`),

    getPostsDefaultPaging: async () =>
        getRequest()
            .get(`${routePaths.posts}`),

    getPostsPaging: async (query: any) =>
        getRequest()
            .get(`${routePaths.posts}/${query}`),

    getPostsByBlogIdPaging: async (query: any, blogId: string) => {

        return getRequest()
            .get(`${routePaths.blogs}/${blogId}${routePaths.posts}/${query}`)
    },

    createManyPosts: async function (manyPostsSendBody: any) {
        const posts = []
        for (const postSendBody of manyPostsSendBody) {
            const result = await this.createPost(postSendBody, auth.basic_TRUE)
            posts.push(result.body)
        }
        return posts
    },

    updatePostById: async (bodyUpdate: any, id: string, authBasic: BasicType) =>
        getRequest()
            .put(`${routePaths.posts}/${id}`)
            .set(authBasic.type, authBasic.password)
            .send(bodyUpdate),

    deletePostById: async (id: string, authBasic: BasicType) =>
        getRequest()
            .delete(`${routePaths.posts}/${id}`)
            .set(authBasic.type, authBasic.password),
}