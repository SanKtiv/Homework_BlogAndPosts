import {Request, Response, Router} from 'express';
import {validId, validBlog} from "../../validations/blogs-validators";
import {validPost} from "../../validations/posts-validators";
import {checkExistBlogByBlogId} from "../../middlewares/blogs-middlewares";
import {errorMiddleware} from "../../middlewares/error-validators-middleware";
import {basicAuth} from "../../middlewares/authorization-basic";
import {BlogsService} from "../../services/blogs-service";
import {BlogsRepositoryQuery} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";
import {PostsService} from "../../services/posts-service";
import {constants} from "http2";
import {BlogHandlers} from "./blog-handlers";
import {PostsHandler} from "../posts/post-handler";

export const blogRouter = Router({})

class BlogsController {

    private blogsRepositoryQuery: BlogsRepositoryQuery
    private blogsService: BlogsService
    private blogHandlers: BlogHandlers
    private postsService: PostsService
    private postsHandler: PostsHandler

    constructor() {

        this.blogsService = new BlogsService()
        this.blogsRepositoryQuery = new BlogsRepositoryQuery()
        this.blogHandlers = new BlogHandlers()
        this.postsService = new PostsService()
        this.postsHandler = new PostsHandler()
    }

    async createBlog(req: Request, res: Response) {

        const blogDB = await this.blogsService.createBlog(req.body)

        const blogViewModel = await this.blogHandlers.blogViewModel(blogDB)

        return res.status(constants.HTTP_STATUS_CREATED).send(blogViewModel)
    }

    async createPostForBlog(req: Request, res: Response) {

        const blogId = req.params.blogId

        const blogDB = await this.blogsRepositoryQuery.getBlogById(blogId)

        const postDB = await this.postsService.createPostByBlogId(blogId, req.body, blogDB!.name)

        const postViewModel = await this.postsHandler.createPostViewModel(postDB)

        return res.status(constants.HTTP_STATUS_CREATED).send(postViewModel)
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

const blogsController = new BlogsController()

blogRouter.post('/',
    validBlog,
    basicAuth,
    errorMiddleware.error.bind(errorMiddleware),
    blogsController.createBlog.bind(blogsController))

blogRouter.post('/:blogId/posts',
    validPost,
    basicAuth,
    checkExistBlogByBlogId,
    errorMiddleware.error.bind(errorMiddleware),
    blogsController.createPostForBlog.bind(blogsController))

blogRouter.put('/:id',
    validBlog,
    basicAuth,
    validId,
    errorMiddleware.error.bind(errorMiddleware),
    blogsController.updateBlogById.bind(blogsController))

blogRouter.delete('/:id',
    basicAuth,
    validId,
    blogsController.deleteBlogById.bind(blogsController))