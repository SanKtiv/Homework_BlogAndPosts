import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb";
import {validId, validBlog} from "../validations/blogs-validators";
import {validPost} from "../validations/posts-validators";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb";
import {validErrors, basicAuth, validBlogIdMiddleWare} from "../validations/middlewares";

export const blogRouter = Router ({})

blogRouter.post( '/blogs', validBlog, basicAuth, validErrors, async (req: Request, res: Response) => {
    const blog = await blogsRepository.createBlog(req.body)
    return res.status(201).send(blog)
})

blogRouter.post( '/blogs/:blogId/posts', validPost, basicAuth, validBlogIdMiddleWare, validErrors, async (req: Request, res: Response) => {
    const post = await postsRepository.createPostForBlogId(req.params.blogId, req.body)
    return res.status(201).send(post)
})

blogRouter.put('/blogs/:id', validBlog, basicAuth, validId, validErrors, async (req: Request, res: Response) => {
    const blogIsUpdate = await blogsRepository.updateBlog(req.params.id, req.body)
    if (blogIsUpdate) return res.sendStatus(204)
    return res.sendStatus(404)
})

blogRouter.delete('/blogs/:id', basicAuth, validId, async (req: Request, res: Response) => {
    const blogIsDelete = await blogsRepository.deleteBlogById(req.params.id)
    if (blogIsDelete) return res.sendStatus(204)
    return res.sendStatus(404)
})