import {Request, Response, Router} from 'express';
import {blogsRepository} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-mongodb";
import {validId, validBlog} from "../../validations/blogs-validators";
import {validPost} from "../../validations/posts-validators";
import {postsRepository} from "../../repositories/mongodb-repository/posts-mongodb/posts-mongodb";
import {checkBlogByBlogId} from "../../middlewares/blogs-middlewares";
import {errorsOfValidate} from "../../middlewares/error-validators-middleware";
import {basicAuth} from "../../middlewares/authorization-basic";

export const blogRouter = Router ({})

blogRouter.post( '/', validBlog, basicAuth, errorsOfValidate, async (req: Request, res: Response) => {
    const blog = await blogsRepository.createBlog(req.body)
    console.log('router res', blog)
    return res.status(201).send(blog)
})

blogRouter.post( '/:blogId/posts', validPost, basicAuth, checkBlogByBlogId, errorsOfValidate, async (req: Request, res: Response) => {
    const post = await postsRepository.createPostForBlogId(req.params.blogId, req.body)
    return res.status(201).send(post)
})

blogRouter.put('/:id', validBlog, basicAuth, validId, errorsOfValidate, async (req: Request, res: Response) => {
    const blogIsUpdate = await blogsRepository.updateBlog(req.params.id, req.body)
    if (blogIsUpdate) return res.sendStatus(204)
    return res.sendStatus(404)
})

blogRouter.delete('/:id', basicAuth, validId, async (req: Request, res: Response) => {
    const blogIsDelete = await blogsRepository.deleteBlogById(req.params.id)
    if (blogIsDelete) return res.sendStatus(204)
    return res.sendStatus(404)
})