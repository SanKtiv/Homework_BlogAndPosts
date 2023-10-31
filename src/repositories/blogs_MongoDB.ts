import {BlogBodyType, BlogModelOutType, CreateBlogType} from "../types/typesForMongoDB";
import {idNumber} from "../variables/variables";
import {dbBlogsCollection} from "./db";
import {dateNow} from "../variables/variables";
import {InsertOneResult} from "mongodb";

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogModelOutType[]> {
        return dbBlogsCollection.find({}/*, {projection: {_id: 0}}*/).toArray()
    },

    async getBlogById(id: string): Promise<BlogModelOutType | null> {
        return dbBlogsCollection.findOne({_id: id})
    },

    async createBlog(body: BlogBodyType): Promise<BlogModelOutType | CreateBlogType> {
        const newBlog: CreateBlogType = {
            createdAt: dateNow.toISOString(),
            isMembership: false,
            ...body}
        await dbBlogsCollection.insertOne(newBlog)
        //let {_id, ...newBlogWithout_id} = newBlog
        return newBlog
    },

    async updateBlog(id: string, body: BlogBodyType): Promise<Boolean> {
        const foundBlog = await dbBlogsCollection.updateOne({_id: id}, {
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
