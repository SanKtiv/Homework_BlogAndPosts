import {dbBlogsCollection, dbPostsCollection} from "./db";
import {BlogsOutputQueryType, PostsOutputQueryType} from "../../types/typesForQuery";
import {blogsService} from "../../services/blogs-service";
import {postsService} from "../../services/posts-service";

export const blogsRepositoryQuery = {

    async getBlogsWithPaging(query: any): Promise<BlogsOutputQueryType | null> {

        if (!query.searchNameTerm) {

            const searchNameToRegExp = new RegExp(query.searchNameTerm, 'i')
            const totalBlogsBySearchName = await dbBlogsCollection
                .countDocuments({name: {$regex: searchNameToRegExp}})

            const blogsItemsSearchName = await dbBlogsCollection
                .find({name: {$regex: searchNameToRegExp}})
                .sort({[query.sortBy]: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
                .toArray()

            return blogsService.blogsOutputQuery(totalBlogsBySearchName, blogsItemsSearchName, query)
        }

        const totalBlogs = await dbBlogsCollection.countDocuments()

        const blogsItems = await dbBlogsCollection
            .find()
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return blogsService.blogsOutputQuery(totalBlogs, blogsItems, query)
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

        return postsService.postsOutputQuery(totalPostsByBlogId, postsOutputFromDb, query)
    },
}
