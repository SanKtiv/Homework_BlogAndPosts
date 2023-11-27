import {routePaths} from "../../../src/setting";
import {getRequest} from "../comments.e2e.test";
import {BlogBodyType, BlogType} from "../../../src/types/typesForMongoDB";
import {viewModelBlogsDefaultPaging_TRUE} from "../utility/blogs-utility";

export const blogActions = {

    createBlog: async (blogSendBody: any) =>
        getRequest()
            .post(`${routePaths.blogs}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(blogSendBody),

    async createManyBlogs(manyBlogSendBody: BlogBodyType[]) {

        for (const blogSendBody of manyBlogSendBody) {
            await getRequest()
                .post(`${routePaths.blogs}`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send(blogSendBody)
        }
    },

    async expectCreateBlog(blogSendBody: BlogBodyType, blog: BlogType, statusCode: number ) {

        const result = await this.createBlog(blogSendBody)
        await expect(result.statusCode).toBe(statusCode)
        await expect(result.body).toEqual(blog)
    },

    async getBlogsPaging() {
        return getRequest()
            .get(`${routePaths.blogs}`)
    },

    async expectGetBlogsPaging(statusCode: number) {
        const result = await this.getBlogsPaging()
        const expectItems = viewModelBlogsDefaultPaging_TRUE(10, result.body.items)
        await expect(result.statusCode).toBe(statusCode)
        await expect(result.body.pagesCount).toBe(expectItems.pagesCount)
        await expect(result.body.page).toBe(expectItems.page)
        await expect(result.body.pageSize).toBe(expectItems.pageSize)
        await expect(result.body.totalCount).toBe(expectItems.totalCount)
        await expect(result.body.items).toStrictEqual(expectItems.items)
    }
}