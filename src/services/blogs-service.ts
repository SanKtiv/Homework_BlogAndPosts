import {BlogDBType, BlogType, InputBlogModelType} from "../types/blogs-types";
import {BlogsRepository} from "../repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";

class BlogsService {

    private blogsRepository: BlogsRepository

    constructor() {

        this.blogsRepository = new BlogsRepository()
    }

    async createBlog(body: InputBlogModelType): Promise<BlogDBType> {

        const newBlog = new BlogType(
            body.name,
            body.description,
            body.websiteUrl,
            new Date().toISOString(),
            false
        )

        return this.blogsRepository.insertBlog(newBlog)
    }

    async updateBlogById(id: string, body: InputBlogModelType) {

        return this.blogsRepository.updateBlog(id, body)
    }

    async deleteBlogById(id: string) {

        return this.blogsRepository.deleteBlogById(id)
    }

    async deleteAllBlogs() {

        await this.blogsRepository.deleteAll()
    }
}

export const blogsService = new BlogsService()