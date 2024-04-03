import {InputBlogModelType, BlogDBType, BlogType} from "../../../types/blogs-types";
import {BlogsModel} from "../db";
import {ObjectId} from "mongodb";

export class BlogsRepository {

    async insertBlog(body: BlogType): Promise<BlogDBType> {

        const blogDB = await BlogsModel.create(body)

        return blogDB as BlogDBType
    }

    async updateBlog(id: string, body: InputBlogModelType): Promise<boolean> {

        try {

            const resultUpdate = await BlogsModel.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl
                }
            })

            return resultUpdate.modifiedCount === 1
        }

        catch (e) {
            return false
        }
    }

    async deleteBlogById(id: string): Promise<boolean> {

        try {

            const resultDelete = await BlogsModel.deleteOne({_id: new ObjectId(id)})

            return resultDelete.deletedCount === 1
        }

        catch (e) {
            return false
        }
    }

    async deleteAll(): Promise<void> {

        await BlogsModel.deleteMany({})
    }
}
