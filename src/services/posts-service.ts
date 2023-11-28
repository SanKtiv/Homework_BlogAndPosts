import {WithId} from "mongodb";
import {ViewPostModelType, PostType} from "../types/posts-types";
import {InputPostsPagingType, ViewPostsPagingType} from "../types/posts-types";

export const postsService = {
    postDbInToBlog(postOutDb: WithId<PostType>): ViewPostModelType {

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
        query: InputPostsPagingType): ViewPostsPagingType {

        return {
            pagesCount: Math.ceil(totalBlogs / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalBlogs,
            items: blogsItems.map(blogOutDb => this.postDbInToBlog(blogOutDb))
        }
    },
}