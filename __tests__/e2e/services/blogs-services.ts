import {routePaths} from "../../../src/setting";
import {getRequest} from "../comments.e2e.test";

export const blogActions = {

    createBlog: async (blogSendBody: any) =>
        getRequest()
            .post(`${routePaths.blogs}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(blogSendBody)
}