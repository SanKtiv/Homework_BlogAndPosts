import {Request, Response, Router} from 'express';
import {validId, validBlog} from "../../validations/blogs-validators";
import {validPost} from "../../validations/posts-validators";
import {checkExistBlogByBlogId} from "../../middlewares/blogs-middlewares";
import {errorsOfValidate} from "../../middlewares/error-validators-middleware";
import {basicAuth} from "../../middlewares/authorization-basic";
import {blogsService} from "../../services/blogs-service";
import {blogsRepositoryQuery} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";
import {postsService} from "../../services/posts-service";
import {constants} from "http2";
import {blogHandlers} from "./blog-handlers";

export const blogRouter = Router({})

class BlogsController {

    async createBlog(req: Request, res: Response) {

        const blogDB = await blogsService.createBlog(req.body)

        const blogViewModel = await blogHandlers.blogViewModel(blogDB)

        return res.status(constants.HTTP_STATUS_CREATED).send(blogViewModel)
    }

    async getBlogById(req: Request, res: Response) {

        const blogId = req.params.blogId

        const blogDB = await blogsRepositoryQuery.getBlogById(blogId)

        const post = await postsService.createPostByBlogId(blogId, req.body, blogDB!.name)

        return res.status(constants.HTTP_STATUS_CREATED).send(post)
    }

    async updateBlogById(req: Request, res: Response) {

        const resultUpdate = await blogsService. updateBlogById(req.params.id, req.body)

        if (resultUpdate) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)

        return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
    }

    async deleteBlogById(req: Request, res: Response) {

        const result = await blogsService.deleteBlogById(req.params.id)

        if (result) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)

        return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
    }
}

const blogsController = new BlogsController()

blogRouter.post('/', validBlog, basicAuth, errorsOfValidate, blogsController.createBlog)

blogRouter.post('/:blogId/posts', validPost, basicAuth, checkExistBlogByBlogId, errorsOfValidate, blogsController.getBlogById)

blogRouter.put('/:id', validBlog, basicAuth, validId, errorsOfValidate, blogsController.updateBlogById)

blogRouter.delete('/:id', basicAuth, validId, blogsController.deleteBlogById)

// blogRouter.post('/', validBlog, basicAuth, errorsOfValidate, async (req: Request, res: Response) => {
//
//     const blogDB = await blogsService.createBlog(req.body)
//
//     const blogViewModel = await blogHandlers.blogViewModel(blogDB)
//
//     return res.status(constants.HTTP_STATUS_CREATED).send(blogViewModel)
// })

// blogRouter.post('/:blogId/posts', validPost, basicAuth, checkExistBlogByBlogId, errorsOfValidate, async (req: Request, res: Response) => {
//
//     const blogId = req.params.blogId
//
//     const blogDB = await blogsRepositoryQuery.getBlogById(blogId)
//
//     const post = await postsService.createPostByBlogId(blogId, req.body, blogDB!.name)
//
//     return res.status(constants.HTTP_STATUS_CREATED).send(post)
// })

// blogRouter.put('/:id', validBlog, basicAuth, validId, errorsOfValidate, async (req: Request, res: Response) => {
//
//     const resultUpdate = await blogsService. updateBlogById(req.params.id, req.body)
//
//     if (resultUpdate) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//
//     return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
// })

// blogRouter.delete('/:id', basicAuth, validId, async (req: Request, res: Response) => {
//
//     const result = await blogsService.deleteBlogById(req.params.id)
//
//     if (result) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//
//     return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
// })