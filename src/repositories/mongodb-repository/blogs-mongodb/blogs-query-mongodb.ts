import {BlogsModel, PostsModel} from "../db";
import {InputPostsPagingType, PostDBType} from "../../../types/posts-types";
import {BlogDBType, InputBlogsPagingType} from "../../../types/blogs-types";
import {ObjectId} from "mongodb";

export class BlogsQueryRepository {

    async getBlogById(id: string): Promise<BlogDBType | null> {

        try {
            return BlogsModel.findOne({_id: new ObjectId(id)}).lean()

        } catch (error) {
            return null
        }
    }

    async getTotalBlogs() {

        return BlogsModel.countDocuments()
    }

    async getTotalBlogsByName(name: string) {

        return BlogsModel
            .countDocuments({name: {$regex: name, $options: 'i'}})
    }

    async getBlogsWithPaging(query: InputBlogsPagingType): Promise<BlogDBType[]> {

        if (query.searchNameTerm) {

            return BlogsModel
                .find({name: {$regex: query.searchNameTerm, $options: 'i'}})
                .sort({[query.sortBy]: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
                .lean()
        }

        return BlogsModel
            .find()
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .lean()
    }

    async getPostsByBlogId(blogId: string, query: InputPostsPagingType): Promise<PostDBType[]> {

        return PostsModel
            .find({blogId: blogId})
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .lean()
    }
}
