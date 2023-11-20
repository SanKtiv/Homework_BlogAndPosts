import {WithId} from "mongodb";
import {PostModelOutType, PostType} from "../types/typesForMongoDB";
import {PostsByBlogIdInputPagingType, PostsOutputQueryType} from "../types/typesForQuery";

export const postsService = {
    postDbInToBlog(postOutDb: WithId<PostType>): PostModelOutType {

        return  {
            id: postOutDb._id.toString(),
            title: postOutDb.title,
            shortDescription: postOutDb.shortDescription,
            content: postOutDb.content,
            blogId: postOutDb.blogId,
            blogName: postOutDb.blogName,
            createdAt: postOutDb.createdAt
        }
    },

    postsOutputQuery(
        totalBlogs: number,
        blogsItems: WithId<PostType>[],
        query: PostsByBlogIdInputPagingType): PostsOutputQueryType {

        return {
            pagesCount: Math.ceil(totalBlogs / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalBlogs,
            items: blogsItems.map(blogOutDb => this.postDbInToBlog(blogOutDb))
        }
    },
}