import {Request, Response, Router} from 'express';
import {postsRepository} from "../repositories/posts_MongoDB";
import {validationResult} from 'express-validator'
import {errorMessage} from "../variables/variables";
import {validId, validAuthorize} from "../validations/validations";

export const postRouter = Router ({})

postRouter.get( '/', async (req: Request, res: Response) => {
    return res.status(200).send(await postsRepository.getAllPosts())
})

postRouter.get( '/:id', async (req: Request, res: Response) => {
    const posts = await postsRepository.getPostById(req.params.id)
    return posts ? res.status(200).send(posts) : res.sendStatus(404)

})

postRouter.post( '/', validAuthorize, async (req: Request, res: Response) => {
    const error = validationResult(req)// сделать middleware с проверкой
    if (error.isEmpty()) {
        const postById = await postsRepository.createPost(req.body)
        return res.status(201).send(postById)
    }
    return res.status(400).send(errorMessage(error))
})

postRouter.put('/:id', validAuthorize, validId, async (req: Request, res: Response) => {
    const error = validationResult(req)// сделать middleware с проверкой
    if (error.isEmpty()) {
        return await postsRepository.updatePost(req.params.id, req.body) ?
            res.sendStatus(204) :
            res.sendStatus(404)
    }
    return res.status(400).send(errorMessage(error))
})

postRouter.delete('/:id', validAuthorize, validId, async (req: Request, res: Response) => {
    return await postsRepository.deletePostById(req.params.id) ?
        res.sendStatus(204) :
        res.sendStatus(404)
})