import {routePaths} from "../../../src/setting";
import {getRequest} from "../comments.e2e.test";
import {BasicType} from "../utility/auth-utility";

export const postActions = {

    createPost: async (postSendBody: any, authBasic: BasicType) =>
        getRequest()
            .post(`${routePaths.posts}`)
            .set(authBasic.type, authBasic.password)
            .send(postSendBody)
}