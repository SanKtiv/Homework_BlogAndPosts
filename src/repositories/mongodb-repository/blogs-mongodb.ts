import {BlogBodyType, BlogModelOutType, BlogType} from "../../types/typesForMongoDB";
import {dbBlogsCollection} from "./db";
import {ObjectId, WithId} from "mongodb";
import {blogsService} from "../../services/blogs-service";

export const blogsRepository = {
    // blogDbInToBlog(blogOutDb: WithId<BlogType>): BlogModelOutType {
    //     // const {_id, ...withOutId} = blogOutDb
    //     // return  {id:blogOutDb._id.toString(), ...withOutId}
    //     return {
    //         id: blogOutDb._id.toString(),
    //         name: blogOutDb.name,
    //         description: blogOutDb.description,
    //         websiteUrl: blogOutDb.websiteUrl,
    //         createdAt: blogOutDb.createdAt,
    //         isMembership: blogOutDb.isMembership
    //     }
    // },

    async getAllBlogs(): Promise<BlogModelOutType[]> {

        const allBlogs = await dbBlogsCollection.find().toArray()
        return allBlogs.map(blogOutDb => blogsService.blogDbInToBlog(blogOutDb))
    },

    async getBlogById(id: string): Promise<BlogModelOutType | boolean> {

        const blogOutDb = await dbBlogsCollection.findOne({_id: new ObjectId(id)})
        if (blogOutDb === null) return false
        return blogsService.blogDbInToBlog(blogOutDb)
    },

    async createBlog(body: BlogBodyType): Promise<BlogModelOutType> {

        // const newBlog: BlogType = {
        //     createdAt: dateNow().toISOString(),
        //     isMembership: false,
        //     ...body
        // }
        const newBlog = await blogsService.newBlog(body)
        await dbBlogsCollection.insertOne(newBlog)
        return blogsService.blogDbInToBlog(newBlog as WithId<BlogType>)
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
