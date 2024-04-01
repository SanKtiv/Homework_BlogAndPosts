import {InputBlogModelType, BlogDBType, BlogType} from "../../../types/blogs-types";
import {BlogsModel, dbBlogsCollection} from "../db";
import {ObjectId} from "mongodb";

export class BlogsRepository {

    async insertBlog(body: BlogType): Promise<BlogDBType> {

        const blogDB = await BlogsModel.create(body)

        return blogDB as BlogDBType
    }

    async updateBlog(id: string, body: InputBlogModelType): Promise<Boolean> {

        const foundBlog = await BlogsModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        })
        return foundBlog.nM=== 1
    }

    async deleteBlogById(id: string): Promise<Boolean> {

        const result = await BlogsModel.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }

    async deleteAll(): Promise<void> {

        await dbBlogsCollection.deleteMany({})
    }
}
