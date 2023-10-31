import {BlogBodyType, BlogModelOutType, BlogType} from "../types/typesForMongoDB";
import {idNumber} from "../variables/variables";
import {dbBlogsCollection} from "./db";
import {dateNow} from "../variables/variables";
import {InsertOneResult, ObjectId} from "mongodb";

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogModelOutType[]> {
        return dbBlogsCollection.find().toArray()
    },

    async getBlogById(id: string): Promise<BlogModelOutType | null> {
        return dbBlogsCollection.findOne({_id: new ObjectId(id)})
    },

    async createBlog(body: BlogBodyType): Promise<BlogModelOutType | BlogType> {
        const newBlog: BlogType = {
            createdAt: dateNow.toISOString(),
            isMembership: false,
            ...body}
        const dada = await dbBlogsCollection.insertOne(newBlog)
        //let {_id, ...newBlogWithout_id} = newBlog
        return newBlog
    },

    async updateBlog(id: string, body: BlogBodyType): Promise<Boolean> {
        const foundBlog = await dbBlogsCollection.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl
                }
            })
        return foundBlog.matchedCount === 1
    },

    async deleteBlogById(id: string): Promise<Boolean> {

        const deleteBlog = await dbBlogsCollection.deleteOne({id: id})
          return deleteBlog.deletedCount === 1
    },

    async deleteAll(): Promise<void> {
        await dbBlogsCollection.deleteMany({})
    }
}
