import {dbPostsCollection} from "./db";
import {PostsOutputQueryType} from "../../types/typesForQuery";
import {postsService} from "../../services/posts-service";

export const postsRepositoryQuery = {

    // blogsOutputQuery(
    //     totalBlogs: number,
    //     blogsItems: WithId<BlogType>[],
    //     query: InputQueryWithSearchNameType): BlogsOutputQueryType {
    //
    //     return {
    //         pagesCount: Math.ceil(totalBlogs / +query.pageSize),
    //         page: +query.pageNumber,
    //         pageSize: +query.pageSize,
    //         totalCount: totalBlogs,
    //         items: blogsItems.map(blogOutDb => blogsRepository.blogDbInToBlog(blogOutDb))
    //     }
    // },

    // postsOutputQuery(
    //     totalBlogs: number,
    //     blogsItems: WithId<PostType>[],
    //     query: InputQueryType): PostsOutputQueryType {
    //
    //     return {
    //         pagesCount: Math.ceil(totalBlogs / +query.pageSize),
    //         page: +query.pageNumber,
    //         pageSize: +query.pageSize,
    //         totalCount: totalBlogs,
    //         items: blogsItems.map(blogOutDb => postsRepository.postDbInToBlog(blogOutDb))
    //     }
    // },

    async getPostsWithPaging(query: any): Promise<PostsOutputQueryType> {

        const totalPosts = await dbPostsCollection.countDocuments()

        const postsOutputFromDb = await dbPostsCollection
            .find()
            .sort({createdAt: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return postsService.postsOutputQuery(totalPosts, postsOutputFromDb, query)
    },
}