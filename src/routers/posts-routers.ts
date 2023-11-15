import {Request, Response, Router} from 'express';
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb";
import {validId} from "../validations/blogs-validators";
import {validPostBlogId} from "../validations/posts-validators";
import {validErrors, basicAuth} from "../validations/middlewares";

export const postRouter = Router ({})

postRouter.post( '/posts', validPostBlogId, basicAuth, validErrors, async (req: Request, res: Response) => {
    const post = await postsRepository.createPost(req.body)
    return res.status(201).send(post)
})

postRouter.put('/posts/:id', validPostBlogId, basicAuth, validId, validErrors, async (req: Request, res: Response) => {
    const postIsUpdate = await postsRepository.updatePost(req.params.id, req.body)
    if (postIsUpdate) return res.sendStatus(204)
    return res.sendStatus(404)
})

postRouter.delete('/posts/:id', basicAuth, validId, async (req: Request, res: Response) => {
    const postIsDelete = await postsRepository.deletePostById(req.params.id)
    if (postIsDelete) return res.sendStatus(204)
    return res.sendStatus(404)
})