import {BlogType, PostType} from "../../types/typesForMongoDB";
import {dbPostsCollection} from "./db";
import {WithId} from "mongodb";
import {
    BlogsOutputQueryType,
    InputQueryWithSearchNameType,
    PostsOutputQueryType,
    InputQueryType,
} from "../../types/typesForQuery";
import {blogsRepository} from "./blogs-mongodb";
import {postsRepository} from "./posts-mongodb";

export const postsRepositoryQuery = {

    blogsOutputQuery(
        totalBlogs: number,
        blogsItems: WithId<BlogType>[],
        query: InputQueryWithSearchNameType): BlogsOutputQueryType {

        return {
            pagesCount: Math.ceil(totalBlogs / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalBlogs,
            items: blogsItems.map(blogOutDb => blogsRepository.blogDbInToBlog(blogOutDb))
        }
    },

    postsOutputQuery(
        totalBlogs: number,
        blogsItems: WithId<PostType>[],
        query: InputQueryType): PostsOutputQueryType {

        return {
            pagesCount: Math.ceil(totalBlogs / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalBlogs,
            items: blogsItems.map(blogOutDb => postsRepository.postDbInToBlog(blogOutDb))
        }
    },

    async getPostsWithPaging(query: any): Promise<PostsOutputQueryType> {

        const totalPosts = await dbPostsCollection.countDocuments()
        //if (totalPosts === 0) return null
        const postsOutputFromDb = await dbPostsCollection
            .find()
            .sort({createdAt: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return this.postsOutputQuery(totalPosts, postsOutputFromDb, query)
    },
}