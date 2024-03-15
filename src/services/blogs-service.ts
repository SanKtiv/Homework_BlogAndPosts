import {
    BlogType,
    InputBlogModelType,
    ViewBlogModelType,
} from "../types/blogs-types";
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";
import {blogHandlers} from "../routers/blogs/blog-handlers";

class BlogsService {
    async createBlog(body: InputBlogModelType): Promise<ViewBlogModelType> {

        const newBlog = new BlogType(
            body.name,
            body.description,
            body.websiteUrl,
            new Date().toISOString(),
            false
        )

        const blogFromDB = await blogsRepository.insertBlog(newBlog)

        return blogHandlers.blogViewModel(blogFromDB)
    }
}

export const blogsService = new BlogsService()