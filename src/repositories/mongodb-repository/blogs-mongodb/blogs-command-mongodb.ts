import {InputBlogModelType, BlogDBType, BlogType} from "../../../types/blogs-types";
import {dbBlogsCollection} from "../db";
import {ObjectId} from "mongodb";

export class BlogsRepository {

    async insertBlog(body: BlogType): Promise<BlogDBType> {

        await dbBlogsCollection.insertOne(body)

        return body as BlogDBType
    }

    async updateBlog(id: string, body: InputBlogModelType): Promise<Boolean> {

        const foundBlog = await dbBlogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        })
        return foundBlog.matchedCount === 1
    }

    async deleteBlogById(id: string): Promise<Boolean> {

        const result = await dbBlogsCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }

    async deleteAll(): Promise<void> {

        await dbBlogsCollection.deleteMany({})
    }
}

export const blogsRepository = new BlogsRepository()
