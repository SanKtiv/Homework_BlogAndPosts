import {
    BlogDBType,
    BlogType,
    InputBlogModelType,
    ViewBlogModelType,
    InputBlogsPagingType,
    ViewBlogsPagingType
} from "../types/blogs-types";
import {dateNow} from "../variables/variables";

export const blogsService = {

    blogDbInToBlog(blogOutDb: BlogDBType): ViewBlogModelType {

        return {
            id: blogOutDb._id.toString(),
            name: blogOutDb.name,
            description: blogOutDb.description,
            websiteUrl: blogOutDb.websiteUrl,
            createdAt: blogOutDb.createdAt,
            isMembership: blogOutDb.isMembership
        }
    },

    blogsOutputQuery(
        totalBlogs: number,
        blogsItems: BlogDBType[],
        query: InputBlogsPagingType): ViewBlogsPagingType {

        return {
            pagesCount: Math.ceil(totalBlogs / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalBlogs,
            items: blogsItems.map(blogOutDb => this.blogDbInToBlog(blogOutDb))
        }
    },

    async newBlog(body: InputBlogModelType): Promise<BlogType> {

        return {
            createdAt: dateNow().toISOString(),
            isMembership: false,
            ...body
        }
    }
}