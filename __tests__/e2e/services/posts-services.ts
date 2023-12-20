import {routePaths} from "../../../src/setting";
import {getRequest} from "../comments.e2e.test";
import {BasicType} from "../utility/auth-utility";

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

    createManyPosts: async function (manyPostsSendBody: any, authBasic: BasicType) {
        const items = []
        for (const postSendBody of manyPostsSendBody) {
            const result = await this.createPost(postSendBody, authBasic)
            items.push(result.body)
        }
        return items
    },

    updatePostById: async (bodyUpdate: any, id: string, authBasic: BasicType) =>
        getRequest()
            .put(`${routePaths.posts}/${id}`)
            .set(authBasic.type, authBasic.password)
            .send(bodyUpdate),
}