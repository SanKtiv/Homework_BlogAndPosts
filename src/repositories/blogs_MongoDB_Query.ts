import {BlogBodyType, BlogModelOutType, BlogType} from "../types/typesForMongoDB";
import {dbBlogsCollection, dbBlogsCollectionForQuery} from "./db";
import {dateNow} from "../variables/variables";
import {ObjectId, WithId} from "mongodb";
import {BlogsOutputQueryType, RequestQueryType} from "../types/typesForQuery";

export const blogsRepositoryQuery = {
    blogDbInToBlog(blogOutDb: WithId<BlogType>): BlogModelOutType {
        return {
            id: blogOutDb._id.toString(),
            name: blogOutDb.name,
            description: blogOutDb.description,
            websiteUrl: blogOutDb.websiteUrl,
            createdAt: blogOutDb.createdAt,
            isMembership: blogOutDb.isMembership
        }
    },

    // async getAllBlogs(): Promise<BlogModelOutType[]> {
    //     const allBlogs = await dbBlogsCollection.find().toArray()
    //     return allBlogs.map(blogOutDb => this.blogDbInToBlog(blogOutDb))
    // },

    async getBlogsWithPaging(query: any): Promise<BlogsOutputQueryType | null> {
        const countBlogs = await dbBlogsCollection.countDocuments()
        console.log(countBlogs)

        // if (query.searchNameTerm) {
        //     const regexpSearchName = new RegExp(query.searchNameTerm)
        //     const blogsItems = await dbBlogsCollectionForQuery.find({name: {$regex: regexpSearchName}}).skip(5).limit(5)
        // }

        const blogsItems = await dbBlogsCollection
            .find()
            .skip(query.pageNumber - 1)
            .limit(+query.pageSize)
            .sort({createdAt: 1})
            .toArray()

        const blogsOutputQuery: BlogsOutputQueryType = {
            pagesCount: Math.ceil(countBlogs / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: countBlogs,
            items: blogsItems.map(blogOutDb => this.blogDbInToBlog(blogOutDb))
        }
        return blogsOutputQuery
    },

    // async createBlog(body: BlogBodyType): Promise<BlogModelOutType> {
    //     const newBlog: BlogType = {
    //         createdAt: dateNow.toISOString(),
    //         isMembership: false,
    //         ...body
    //     }
    //     await dbBlogsCollection.insertOne(newBlog)
    //     //let {_id, ...newBlogWithout_id} = newBlog
    //     return this.blogDbInToBlog(newBlog as WithId<BlogType>)
    // },
    //
    // async updateBlog(id: string, body: BlogBodyType): Promise<Boolean> {
    //     const foundBlog = await dbBlogsCollection.updateOne({_id: new ObjectId(id)}, {
    //         $set: {
    //             name: body.name,
    //             description: body.description,
    //             websiteUrl: body.websiteUrl
    //         }
    //     })
    //     return foundBlog.matchedCount === 1
    // },
    //
    // async deleteBlogById(id: string): Promise<Boolean> {
    //
    //     const deleteBlog = await dbBlogsCollection.deleteOne({_id: new ObjectId(id)})
    //     return deleteBlog.deletedCount === 1
    // },
    //
    // async deleteAll(): Promise<void> {
    //     await dbBlogsCollection.deleteMany({})
    // }
}
