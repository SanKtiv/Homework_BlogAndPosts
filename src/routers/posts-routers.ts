import {Request, Response, Router} from 'express';
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb";
import {validId, validAuthorize, errorsOfValidation} from "../validations/validations";

export const postRouter = Router ({})

postRouter.get( '/', async (req: Request, res: Response) => {
    return res.status(200).send(await postsRepository.getAllPosts())
})

postRouter.get( '/:id', async (req: Request, res: Response) => {
    const posts = await postsRepository.getPostById(req.params.id)
    if (posts) return res.status(200).send(posts)
    return res.sendStatus(404)
})

postRouter.post( '/', validAuthorize, errorsOfValidation, async (req: Request, res: Response) => {
    const post = await postsRepository.createPost(req.body)
    return res.status(201).send(post)
})

postRouter.put('/:id', validAuthorize, validId, errorsOfValidation, async (req: Request, res: Response) => {
    const postIsUpdate = await postsRepository.updatePost(req.params.id, req.body)
    if (postIsUpdate) return res.sendStatus(204)
    return res.sendStatus(404)
})

postRouter.delete('/:id', validAuthorize, validId, async (req: Request, res: Response) => {
    const postIsDelete = await postsRepository.deletePostById(req.params.id)
    if (postIsDelete) return res.sendStatus(204)
    return res.sendStatus(404)
})