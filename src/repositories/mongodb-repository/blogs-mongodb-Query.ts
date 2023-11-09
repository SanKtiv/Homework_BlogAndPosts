import {BlogType, PostType} from "../../types/typesForMongoDB";
import {dbBlogsCollection, dbPostsCollection} from "./db";
import {WithId} from "mongodb";
import {BlogsOutputQueryType, InputQueryWithSearchNameType, PostsOutputQueryType, InputQueryType} from "../../types/typesForQuery";
import {blogsRepository} from "./blogs-mongodb";
import {postsRepository} from "./posts-mongodb";

export const blogsRepositoryQuery = {
    // blogDbInToBlog(blogOutDb: WithId<BlogType>): BlogModelOutType {
    //     return {
    //         id: blogOutDb._id.toString(),
    //         name: blogOutDb.name,
    //         description: blogOutDb.description,
    //         websiteUrl: blogOutDb.websiteUrl,
    //         createdAt: blogOutDb.createdAt,
    //         isMembership: blogOutDb.isMembership
    //     }
    // },

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

    async getBlogsWithPaging(query: any): Promise<BlogsOutputQueryType | null> {

        if (query.searchNameTerm !== 'null') {
            const searchNameToRegExp = new RegExp(query.searchNameTerm)
            const totalBlogsBySearchName = await dbBlogsCollection
                .countDocuments({name: {$regex: searchNameToRegExp}})

            const blogsItemsSearchName = await dbBlogsCollection
                .find({name: {$regex: searchNameToRegExp}})
                .sort({[query.sortBy]: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
                .toArray()

            return this.blogsOutputQuery(totalBlogsBySearchName, blogsItemsSearchName, query)
        }

        const totalBlogs = await dbBlogsCollection.countDocuments()

        const blogsItems = await dbBlogsCollection
            .find()
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return this.blogsOutputQuery(totalBlogs, blogsItems, query)
    },

    async getPostsByBlogId(blogId: string, query: any): Promise<PostsOutputQueryType | null> {

        const totalPostsByBlogId = await dbPostsCollection.countDocuments({blogId: blogId})

        if (totalPostsByBlogId === 0) return null

        const postsOutputFromDb = await dbPostsCollection
            .find({blogId: blogId})
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return this.postsOutputQuery(totalPostsByBlogId, postsOutputFromDb, query)
    },
}
