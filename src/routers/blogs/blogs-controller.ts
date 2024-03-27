import {BlogsService} from "../../services/blogs-service";
import {BlogsQueryRepository} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";
import {BlogsHandler} from "./blog-handlers";
import {PostsService} from "../../services/posts-service";
import {PostsHandler} from "../posts/post-handler";
import {PostsQueryRepository} from "../../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";
import {JwtService} from "../../applications/jwt-service";
import {Request, Response} from "express";
import {constants} from "http2";
import {InputBlogsPagingType} from "../../types/blogs-types";
import {InputPostsPagingType} from "../../types/posts-types";

export class BlogsController {

    constructor(protected blogsService: BlogsService,
                protected blogsRepositoryQuery: BlogsQueryRepository,
                protected blogsHandler: BlogsHandler,
                protected postsService: PostsService,
                protected postsHandler: PostsHandler,
                protected postsQueryRepository: PostsQueryRepository,
                protected jwtService: JwtService) {}

    async createBlog(req: Request, res: Response) {

        const blogDB = await this.blogsService.createBlog(req.body)

        const blogViewModel = await this.blogsHandler.blogViewModel(blogDB)

        return res.status(constants.HTTP_STATUS_CREATED).send(blogViewModel)
    }

    async createPostForBlog(req: Request, res: Response) {

        const blogId = req.params.blogId

        const blogDB = await this.blogsRepositoryQuery.getBlogById(blogId)

        const postDB = await this.postsService.createPostByBlogId(blogId, req.body, blogDB!.name)

        const postViewModel = await this.postsHandler.createPostViewModel(postDB)

        return res.status(constants.HTTP_STATUS_CREATED).send(postViewModel)
    }

    async getBlogsWithPaging(req: Request, res: Response) {

        const query = req.query as InputBlogsPagingType

        const totalBlogs = query.searchNameTerm ?
            await this.blogsRepositoryQuery.getTotalBlogsByName(query.searchNameTerm) :
            await this.blogsRepositoryQuery.getTotalBlogs()

        const blogsPagingDB = await this.blogsRepositoryQuery.getBlogsWithPaging(query)

        const blogsPagingView = await this.blogsHandler
            .blogPagingViewModel(totalBlogs, blogsPagingDB, query)

        res.status(constants.HTTP_STATUS_OK).send(blogsPagingView)
    }

    async getPostsByBlogId(req: Request, res: Response) {

        const blogId = req.params.blogId

        const headersAuth = req.headers.authorization

        const query = req.query as InputPostsPagingType

        const totalPostsByBlogId = await this.postsQueryRepository.getCountPostsByBlogId(blogId)

        const postsByBlogId = await this.blogsRepositoryQuery.getPostsByBlogId(blogId, query)

        if (!postsByBlogId.length) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

        if (headersAuth) {

            const payLoad = await this.jwtService.getPayloadAccessToken(headersAuth)

            if (payLoad) {

                const postPagingViewModel = await this.postsHandler
                    .createPostPagingViewModel(totalPostsByBlogId, postsByBlogId, query, payLoad.userId)

                return res.status(constants.HTTP_STATUS_OK).send(postPagingViewModel)
            }
        }

        const postPagingViewModel = await this.postsHandler
            .createPostPagingViewModel(totalPostsByBlogId, postsByBlogId, query)

        return res.status(constants.HTTP_STATUS_OK).send(postPagingViewModel)
    }

    async getBlogById(req: Request, res: Response) {

        const blogDB = await this.blogsRepositoryQuery.getBlogById(req.params.id)

        if (!blogDB) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

        const blog = await this.blogsHandler.blogViewModel(blogDB)

        return res.status(constants.HTTP_STATUS_OK).send(blog)
    }

    async updateBlogById(req: Request, res: Response) {

        const resultUpdate = await this.blogsService.updateBlogById(req.params.id, req.body)

        if (resultUpdate) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)

        return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
    }

    async deleteBlogById(req: Request, res: Response) {

        const result = await this.blogsService.deleteBlogById(req.params.id)

        if (result) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)

        return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
    }
}