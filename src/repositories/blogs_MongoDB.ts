import {BlogModelOutType} from "../types/types";
import {idNumber} from "../variables/variables";
import {client} from "./db";
import {dateNow} from "../variables/variables";
import {validTitle} from "../validations/validations";

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogModelOutType[]> {
        return client
            .db('tube')
            .collection<BlogModelOutType>('blogs')
            .find()
            .toArray()
    },
    async getBlogById(id: string): Promise<BlogModelOutType | null> {
        return client
            .db('tube')
            .collection<BlogModelOutType>('blogs')
            .findOne({id: id})
    },
    async createBlog(body: any): Promise<BlogModelOutType> {

        const newBlog: BlogModelOutType = {
            id: idNumber(),
            createdAt: dateNow.toISOString(),
            isMembership: false,
            ...body}
        await client
            .db('tube')
            .collection<BlogModelOutType>('blogs')
            .insertOne(newBlog)
        return newBlog
    },
    async updateBlog(id: string, body: any): Promise<Boolean> {
        const foundBlog = await client
            .db('tube')
            .collection('blogs')
            .updateOne({id: id}, {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl
                }
            })
        return foundBlog.matchedCount === 1
    },
    async deleteBlogById(id: string): Promise<Boolean> {

        const deleteBlog = await client
            .db('tube')
            .collection('blogs')
            .deleteOne({id: id})
          return deleteBlog.deletedCount === 1
    },
    // async deleteAll(): void {
    //     blogsDataBase.splice(0, blogsDataBase.length)
    // }
}
