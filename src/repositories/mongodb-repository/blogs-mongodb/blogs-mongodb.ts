import {InputBlogModelType, ViewBlogModelType, BlogDBType} from "../../../types/blogs-types";
import {BlogModel, dbBlogsCollection} from "../db";
import {ObjectId} from "mongodb";
import {blogsService} from "../../../services/blogs-service";

export const blogsRepository = {

    async getAllBlogs(): Promise<ViewBlogModelType[]> {

        const allBlogs = await dbBlogsCollection.find().toArray()
        return allBlogs.map(blogOutDb => blogsService.createViewBlogModel(blogOutDb))
    },

    async getBlogById(id: string): Promise<ViewBlogModelType | null> {

        try {
            const blogDB = await dbBlogsCollection.findOne({_id: new ObjectId(id)})
            if (blogDB) return blogsService.createViewBlogModel(blogDB)
            return null
        } catch (error) {
            return null
        }
        // if (blogOutDb === null) return false
        // return blogsService.blogDbInToBlog(blogOutDb)
    },

    async createBlog(body: InputBlogModelType): Promise<BlogDBType> {
        return BlogModel.create(body)
    },

    async updateBlog(id: string, body: InputBlogModelType): Promise<Boolean> {

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
