import {Request, Response, Router} from 'express';
import {postsRepository} from "../repositories/posts_db";
import {validationResult} from 'express-validator'
import {errorMessage} from "../variables/variables";
import {validId, validAuthorize} from "../validations/validations";

export const postRouter = Router ({})

postRouter.get( '/', (req: Request, res: Response) => {
    res.status(200).send(postsRepository.getAllPosts())
})

postRouter.get( '/:id', (req: Request, res: Response) => {
    const posts = postsRepository.getPostById(req.params.id)
    posts ? res.status(200).send(posts) : res.sendStatus(404)

})

postRouter.post( '/', validAuthorize, (req: Request, res: Response) => {
    const error = validationResult(req)
    if (error.isEmpty()) {
        const postById = postsRepository.createPost(req.body)
        res.status(201).send(postById)
    }
    res.status(400).send(errorMessage(error))
})

postRouter.put('/:id', validAuthorize, validId, (req: Request, res: Response) => {
    const error = validationResult(req)
    if (error.isEmpty()) {
        postsRepository.updatePost(req.params.id, req.body) ?
            res.sendStatus(204) :
            res.sendStatus(404)
    }
    res.status(400).send(errorMessage(error))
})

postRouter.delete('/:id', validAuthorize, validId, (req: Request, res: Response) => {
    postsRepository.deletePostById(req.params.id) ?
        res.sendStatus(204) :
        res.sendStatus(404)
})