import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/blogs_MongoDB";
import {validationResult} from 'express-validator'
import {errorMessage} from "../variables/variables";
import {validId, validAuthorize, errorOfValid} from "../validations/validations";

export const blogRouter = Router ({})

blogRouter.get( '/', async (req: Request, res: Response) => {
    return res.status(200).send(await blogsRepository.getAllBlogs())
})

blogRouter.get( '/:id', async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getBlogById(req.params.id)
    return blogs ? res.status(200).send(blogs) : res.sendStatus(404)

})

blogRouter.post( '/', validAuthorize, errorOfValid, async (req: Request, res: Response) => {
    // const error = validationResult(req)// сделать middleware с проверкой
    // if (error.isEmpty()) {
        const blog = await blogsRepository.createBlog(req.body)
        return res.status(201).send(blog)
    // }
    //     return res.status(400).send(errorMessage(error))
})

blogRouter.put('/:id', validAuthorize, validId, async (req: Request, res: Response) => {
    const error = validationResult(req)// сделать middleware с проверкой
    if (error.isEmpty()) {
        return await blogsRepository.updateBlog(req.params.id, req.body) ?
            res.sendStatus(204) :
            res.sendStatus(404)
    }
    return res.status(400).send(errorMessage(error))
})

blogRouter.delete('/:id', validAuthorize, validId, async (req: Request, res: Response) => {
    return await blogsRepository.deleteBlogById(req.params.id) ?
        res.sendStatus(204) :
        res.sendStatus(404)
})