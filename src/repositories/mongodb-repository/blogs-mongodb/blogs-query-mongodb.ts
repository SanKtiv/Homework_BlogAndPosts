import {dbBlogsCollection, dbPostsCollection} from "../db";
import {InputPostsPagingType, PostDBType} from "../../../types/posts-types";
import {blogsService} from "../../../services/blogs-service";
import {InputBlogsPagingType, ViewBlogModelType, ViewBlogsPagingType} from "../../../types/blogs-types";
import {ObjectId} from "mongodb";

export const blogsRepositoryQuery = {

    async getBlogById(id: string): Promise<ViewBlogModelType | null> {

        try {
            const blogDB = await dbBlogsCollection.findOne({_id: new ObjectId(id)})

            if (blogDB) return blogsService.createViewBlogModel(blogDB)

            return null
        } catch (error) {
            return null
        }
    },

    async getBlogsWithPaging(query: InputBlogsPagingType): Promise<ViewBlogsPagingType | null> {

        if (query.searchNameTerm) {

            const totalBlogsBySearchName = await dbBlogsCollection
                .countDocuments({name: {$regex: query.searchNameTerm, $options: 'i'}})

            const blogsItemsSearchName = await dbBlogsCollection
                .find({name: {$regex: query.searchNameTerm, $options: 'i'}})
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

    async getPostsByBlogId(blogId: string, query: InputPostsPagingType): Promise<PostDBType[]> {

        return dbPostsCollection
            .find({blogId: blogId})
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()
    },
}
