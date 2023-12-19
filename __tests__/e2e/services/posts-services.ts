import {routePaths} from "../../../src/setting";
import {getRequest} from "../comments.e2e.test";
import {BasicType} from "../utility/auth-utility";

export const postActions = {

    createPost: async (postSendBody: any, authBasic: BasicType) =>
        getRequest()
            .post(`${routePaths.posts}`)
            .set(authBasic.type, authBasic.password)
            .send(postSendBody),

    getPostsDefaultPaging: async () =>
        getRequest()
            .get(`${routePaths.posts}`),

    getPostsPaging: async (query: any) =>
        getRequest()
            .get(`${routePaths.posts}/${query}`),

    createManyPosts: async (manyPostsSendBody: any, authBasic: BasicType) => {
        const items = []
        for (const postSendBody of manyPostsSendBody) {
            const result = await getRequest()
                .post(`${routePaths.posts}`)
                .set(authBasic.type, authBasic.password)
                .send(postSendBody)
            items.push(result.body)
        }
        return items
    },


}