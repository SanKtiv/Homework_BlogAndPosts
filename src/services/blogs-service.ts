import {WithId} from "mongodb";
import {BlogBodyType, BlogModelOutType, BlogType} from "../types/typesForMongoDB";
import {dateNow} from "../variables/variables";
import {BlogsOutputQueryType, BlogsInputPagingType} from "../types/typesForQuery";

export const blogsService = {

    blogDbInToBlog(blogOutDb: WithId<BlogType>): BlogModelOutType {

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
        blogsItems: WithId<BlogType>[],
        query: BlogsInputPagingType): BlogsOutputQueryType {

        return {
            pagesCount: Math.ceil(totalBlogs / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalBlogs,
            items: blogsItems.map(blogOutDb => this.blogDbInToBlog(blogOutDb))
        }
    },

    async newBlog(body: BlogBodyType): Promise<BlogType> {

        const newBlog: BlogType = {
            createdAt: dateNow().toISOString(),
            isMembership: false,
            ...body
        }

        return newBlog
    }
}