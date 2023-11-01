import {BlogBodyType, BlogModelOutType, BlogType} from "../types/typesForMongoDB";
import {dbBlogsCollection} from "./db";
import {dateNow} from "../variables/variables";
import {InsertOneResult, ObjectId, WithId} from "mongodb";

export const blogsRepository = {
    blogDbInToBlog(blogOutDb: WithId<BlogType>): BlogModelOutType {
        const {_id, ...withOutId} = blogOutDb
        return  {id:blogOutDb._id.toString(), ...withOutId}
        // return {
        //     id: blogOutDb._id.toString(),
        //     name: blogOutDb.name,
        //     description: blogOutDb.description,
        //     websiteUrl: blogOutDb.websiteUrl,
        //     createdAt: blogOutDb.createdAt,
        //     isMembership: blogOutDb.isMembership
        // }
    },

    async getAllBlogs(): Promise<BlogModelOutType[]> {
        const allBlogs = await dbBlogsCollection.find().toArray()
        return allBlogs.map(blogOutDb => this.blogDbInToBlog(blogOutDb))
    },

    async getBlogById(id: string): Promise<BlogModelOutType | null> {
        const blogOutDb = await dbBlogsCollection.findOne({_id: new ObjectId(id)})
        if (blogOutDb === null) return null
        return this.blogDbInToBlog(blogOutDb)
    },

    async createBlog(body: BlogBodyType): Promise<BlogModelOutType> {
        const newBlog: BlogType = {
            createdAt: dateNow.toISOString(),
            isMembership: false,
            ...body}
        await dbBlogsCollection.insertOne(newBlog)
        //let {_id, ...newBlogWithout_id} = newBlog
        return this.blogDbInToBlog(newBlog as WithId<BlogType>)
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

        const deleteBlog = await dbBlogsCollection.deleteOne({_id: new ObjectId(id)})
          return deleteBlog.deletedCount === 1
    },

    async deleteAll(): Promise<void> {
        await dbBlogsCollection.deleteMany({})
    }
}
