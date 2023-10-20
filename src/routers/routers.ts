import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/blogs_db";
import {validationResult} from 'express-validator'
import {ErrorType} from '../types/types'
import {errorMessage} from "../variables/variables";
import {validId, validAuthorize} from "../validations/validations";

export const appRouter = Router ({})

appRouter.get( '/blogs', (req: Request, res: Response) => {
    res.status(200).send(blogsRepository.getAllBlogs())
})

appRouter.get( '/blogs/:id', (req: Request, res: Response) => {
    const blogs = blogsRepository.getBlogById(req.params.id)
    blogs ? res.status(200).send(blogs) : res.sendStatus(404)

})

appRouter.post( '/blogs', validAuthorize, (req: Request, res: Response) => {
    if (validationResult(req).isEmpty()) {
        const blogById = blogsRepository.createBlog(req.body)
        res.status(201).send(blogById)
    }
        res.status(400).send(errorMessage(validationResult(req)))
})

appRouter.put('/blogs/:id', validAuthorize, validId, (req: Request, res: Response) => {
    blogsRepository.updateBlog(req.params.id, req.body) ?
        res.sendStatus(204) :
        res.sendStatus(404)
})

appRouter.delete('/blogs/:id', validAuthorize, validId, (req: Request, res: Response) => {
    blogsRepository.deleteBlogById(req.params.id) ?
        res.sendStatus(204) :
        res.sendStatus(404)
})

appRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    blogsRepository.deleteAll()
    res.sendStatus(204)
})
