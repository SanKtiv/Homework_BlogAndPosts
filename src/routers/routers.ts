import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/blogs_db";
import {postsRepository} from "../repositories/posts_db";
import {validationResult} from 'express-validator'
import {errorMessage} from "../variables/variables";
import {validId, validAuthorize} from "../validations/validations";

export const blogRouter = Router ({})
export const postRouter = Router ({})
export const dellAllRouter = Router ({})

//////////////////////////////////////////////////////////////////////////////////////////
dellAllRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    blogsRepository.deleteAll()
    postsRepository.deleteAll()
    res.sendStatus(204)
})
//////////////////////////////////////////////////////////////////////////////////////////
blogRouter.get( '/', (req: Request, res: Response) => {
    res.status(200).send(blogsRepository.getAllBlogs())
})

blogRouter.get( '/:id', (req: Request, res: Response) => {
    const blogs = blogsRepository.getBlogById(req.params.id)
    blogs ? res.status(200).send(blogs) : res.sendStatus(404)

})

blogRouter.post( '/', validAuthorize, (req: Request, res: Response) => {
    const error = validationResult(req)
    if (error.isEmpty()) {
        const blogById = blogsRepository.createBlog(req.body)
        res.status(201).send(blogById)
    }
        res.status(400).send(errorMessage(error))
})

blogRouter.put('/:id', validAuthorize, validId, (req: Request, res: Response) => {
    const error = validationResult(req)
    if (error.isEmpty()) {
        blogsRepository.updateBlog(req.params.id, req.body) ?
            res.sendStatus(204) :
            res.sendStatus(404)
    }
    res.status(400).send(errorMessage(error))
})

blogRouter.delete('/:id', validAuthorize, validId, (req: Request, res: Response) => {
    blogsRepository.deleteBlogById(req.params.id) ?
        res.sendStatus(204) :
        res.sendStatus(404)
})

//////////////////////////////////////////////////////////////////////////////////////////
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