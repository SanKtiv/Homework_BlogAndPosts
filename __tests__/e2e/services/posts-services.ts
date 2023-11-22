import {routePaths} from "../../../src/setting";
import {getRequest} from "../comments.e2e.test";

export const postActions = {

    createPost: async (postSendBody: any, blogId: string) =>
        getRequest()
            .post(`${routePaths.posts}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...postSendBody, blogId: blogId})
}