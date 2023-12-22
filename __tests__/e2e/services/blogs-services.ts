import {routePaths} from "../../../src/setting";
import {getRequest} from './test-request'
import {InputBlogModelType} from "../../../src/types/blogs-types";
import {auth, BasicType} from "../utility/auth-utility";

export const blogActions = {

    async createBlog(blogSendBody: any, authBasic: BasicType) {
        return getRequest()
            .post(`${routePaths.blogs}`)
            .set(authBasic.type, authBasic.password)
            .send(blogSendBody)
    },

    async getBlogById(id: string) {
        return getRequest()
            .get(`${routePaths.blogs}/${id}`)
    },

    async createManyBlogs(manyBlogSendBody: InputBlogModelType[]) {
        const blogs = []
        for (const blogSendBody of manyBlogSendBody) {
            const result = await getRequest()
                .post(`${routePaths.blogs}`)
                .set(auth.basic_TRUE.type, auth.basic_TRUE.password)
                .send(blogSendBody)
            blogs.push(result.body)
        }
        return blogs
    },

    async getBlogsPagingDefault() {
        return getRequest()
            .get(`${routePaths.blogs}`)
    },

    async getBlogsPaging(queryPresets: string) {
        return getRequest()
            .get(`${routePaths.blogs}`+`${queryPresets}`)
    },

    async updateBlogById(id: string, blogSendBody: any, authBasic: BasicType) {
        return getRequest()
            .put(`${routePaths.blogs}/${id}`)
            .set(authBasic.type, authBasic.password)
            .send(blogSendBody)
    },

    async deleteBlogById(id: string, authBasic: BasicType) {
        return getRequest()
            .delete(`${routePaths.blogs}/${id}`)
            .set(authBasic.type, authBasic.password)
        },
}