import {BlogBodyType, BlogModelOutType, BlogType} from "../types/typesForMongoDB";
import {dbBlogsCollection, dbBlogsCollectionForQuery, dbPostsCollection} from "./db";
import {dateNow} from "../variables/variables";
import {ObjectId, WithId} from "mongodb";
import {BlogsOutputQueryType, InputQueryWithSearchNameType, PostsOutputByBlogIdType} from "../types/typesForQuery";
import {ParsedUrlQuery} from "querystring";
import {blogsRepository} from "./blogs_MongoDB";
import {postsRepository} from "./posts_MongoDB";

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

    blogsOutputQuery(totalBlogs: number, blogsItems: WithId<BlogType>[], query: InputQueryWithSearchNameType): BlogsOutputQueryType {
        return {
            pagesCount: Math.ceil(totalBlogs / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalBlogs,
            items: blogsItems.map(blogOutDb => blogsRepository.blogDbInToBlog(blogOutDb))
        }
    },

    async getBlogsWithPaging(query: any): Promise<BlogsOutputQueryType | null> {

        if (query.searchNameTerm !== 'null') {
            const searchNameToRegExp = new RegExp(query.searchNameTerm)
            const totalBlogsBySearchName = await dbBlogsCollection
                .countDocuments({name: {$regex: searchNameToRegExp}})

            const blogsItemsSearchName = await dbBlogsCollection
                .find({name: {$regex: searchNameToRegExp}})
                .sort({createdAt: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
                .toArray()

            return this.blogsOutputQuery(totalBlogsBySearchName, blogsItemsSearchName, query)
        }

        const totalBlogs = await dbBlogsCollection.countDocuments()

        const blogsItems = await dbBlogsCollection
            .find()
            .sort({createdAt: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return this.blogsOutputQuery(totalBlogs, blogsItems, query)
    },

    async getPostsByBlogId(blogId: string, query: any): Promise<PostsOutputByBlogIdType | null> {
        const postsOutputFromDb = await dbPostsCollection
            .find({blogId: blogId})
            .sort({createdAt: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        if (!postsOutputFromDb.length) return null
        const totalPostsByBlogId = await dbBlogsCollection
            .countDocuments({blogId: blogId})
        return this.blogsOutputQuery()
        //return postsRepository.postDbInToBlog(postsOutputFromDb)
    },
}
