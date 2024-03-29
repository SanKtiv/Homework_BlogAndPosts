import {dbBlogsCollection, dbPostsCollection} from "../db";
import {InputPostsPagingType, PostDBType} from "../../../types/posts-types";
import {BlogDBType, InputBlogsPagingType} from "../../../types/blogs-types";
import {ObjectId} from "mongodb";

export class BlogsQueryRepository {

    async getBlogById(id: string): Promise<BlogDBType | null> {

        try {
            return dbBlogsCollection.findOne({_id: new ObjectId(id)})

        } catch (error) {
            return null
        }
    }

    async getTotalBlogs() {

        return dbBlogsCollection.countDocuments()
    }

    async getTotalBlogsByName(name: string) {

        return dbBlogsCollection
            .countDocuments({name: {$regex: name, $options: 'i'}})
    }

    async getBlogsWithPaging(query: InputBlogsPagingType): Promise<BlogDBType[]> {

        if (query.searchNameTerm) {

            return dbBlogsCollection
                .find({name: {$regex: query.searchNameTerm, $options: 'i'}})
                .sort({[query.sortBy]: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
                .toArray()
        }

        return dbBlogsCollection
            .find()
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()
    }

    async getPostsByBlogId(blogId: string, query: InputPostsPagingType): Promise<PostDBType[]> {

        return dbPostsCollection
            .find({blogId: blogId})
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()
    }
}
