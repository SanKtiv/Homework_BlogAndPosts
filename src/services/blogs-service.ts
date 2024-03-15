import {
    BlogDBType,
    BlogType,
    InputBlogModelType,
    ViewBlogModelType,
    InputBlogsPagingType,
    ViewBlogsPagingType
} from "../types/blogs-types";
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";

export const blogsService = {

    async getCreatedBlog(body: InputBlogModelType): Promise<ViewBlogModelType> {

        const newBlog = new BlogType(
            body.name,
            body.description,
            body.websiteUrl,
            new Date().toISOString(),
            false
        )

        const blogFromDB = await blogsRepository.createBlog(newBlog)

        return this.createViewBlogModel(blogFromDB)
    },

    createViewBlogModel(blogOutDb: BlogDBType): ViewBlogModelType {

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
            items: blogsItems.map(blogOutDb => this.createViewBlogModel(blogOutDb))
        }
    },
}