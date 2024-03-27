import {BlogDBType, InputBlogsPagingType, ViewBlogModelType, ViewBlogsPagingType} from "../../types/blogs-types";

export class BlogsHandler {

    blogViewModel(blogOutDb: BlogDBType): ViewBlogModelType {

        return {
            id: blogOutDb._id.toString(),
            name: blogOutDb.name,
            description: blogOutDb.description,
            websiteUrl: blogOutDb.websiteUrl,
            createdAt: blogOutDb.createdAt,
            isMembership: blogOutDb.isMembership
        }
    }

    blogPagingViewModel(
        totalBlogs: number,
        blogsItems: BlogDBType[],
        query: InputBlogsPagingType): ViewBlogsPagingType {

        return {
            pagesCount: Math.ceil(totalBlogs / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalBlogs,
            items: blogsItems.map(blogOutDb => this.blogViewModel(blogOutDb))
        }
    }
}

export const blogsHandler = new BlogsHandler()