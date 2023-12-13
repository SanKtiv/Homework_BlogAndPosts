import {routePaths} from "../../../src/setting";
import {getRequest} from "../comments.e2e.test";
import {InputBlogModelType, BlogType} from "../../../src/types/blogs-types";
import {viewModelBlogsDefaultPaging_TRUE} from "../utility/blogs-utility";
import {auth, AuthType, BasicType} from "../utility/auth-utility";

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

        for (const blogSendBody of manyBlogSendBody) {
            await getRequest()
                .post(`${routePaths.blogs}`)
                .set(auth.basic_TRUE.type, auth.basic_TRUE.password)
                .send(blogSendBody)
        }
    },

    async expectCreateBlog(blogSendBody: InputBlogModelType, blog: BlogType, statusCode: number ) {

        const result = await this.createBlog(blogSendBody, auth.basic_TRUE)
        await expect(result.statusCode).toBe(statusCode)
        await expect(result.body).toEqual(blog)
    },

    async getBlogsPagingDefault() {
        return getRequest()
            .get(`${routePaths.blogs}`)
    },

    async getBlogsPaging(queryPresets: string) {
        return getRequest()
            .get(`${routePaths.blogs}`+`${queryPresets}`)
    },

    // async expectGetBlogsPaging(statusCode: number) {
    //     const result = await this.getBlogsPaging()
    //     const expectItems = viewModelBlogsDefaultPaging_TRUE(10, result.body.items)
    //     await expect(result.statusCode).toBe(statusCode)
    //     await expect(result.body.pagesCount).toBe(expectItems.pagesCount)
    //     await expect(result.body.page).toBe(expectItems.page)
    //     await expect(result.body.pageSize).toBe(expectItems.pageSize)
    //     await expect(result.body.totalCount).toBe(expectItems.totalCount)
    //     await expect(result.body.items).toStrictEqual(expectItems.items)
    // }
}