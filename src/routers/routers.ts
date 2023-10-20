import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/blogs_db";
import {postsRepository} from "../repositories/posts_db";
import {validationResult} from 'express-validator'
import {errorMessage} from "../variables/variables";
import {validId, validAuthorize} from "../validations/validations";

export const appRouter = Router ({})
//////////////////////////////////////////////////////////////////////////////
appRouter.get( '/blogs', (req: Request, res: Response) => {
    res.status(200).send(blogsRepository.getAllBlogs())
})

appRouter.get( '/blogs/:id', (req: Request, res: Response) => {
    const blogs = blogsRepository.getBlogById(req.params.id)
    blogs ? res.status(200).send(blogs) : res.sendStatus(404)

})

appRouter.post( '/blogs', validAuthorize, (req: Request, res: Response) => {

    const errore = validationResult(req)
    if (errore.isEmpty()) {
        const blogById = blogsRepository.createBlog(req.body)
        res.status(201).send(blogById)
    }
        res.status(400).send(errorMessage(errore))
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
    postsRepository.deleteAll()
    res.sendStatus(204)
})
////////////////////////////////////////////////////////////////////////////////
appRouter.get( '/posts', (req: Request, res: Response) => {
    res.status(200).send(postsRepository.getAllPosts())
})

appRouter.get( '/posts/:id', (req: Request, res: Response) => {
    const posts = postsRepository.getPostById(req.params.id)
    posts ? res.status(200).send(posts) : res.sendStatus(404)

})

appRouter.post( '/posts', validAuthorize, (req: Request, res: Response) => {
    const errore = validationResult(req)
    if (errore.isEmpty()) {
        const postById = postsRepository.createPost(req.body)
        res.status(201).send(postById)
    }
    res.status(400).send(errorMessage(errore))
})

appRouter.put('/posts/:id', validAuthorize, validId, (req: Request, res: Response) => {
    postsRepository.updatePost(req.params.id, req.body) ?
        res.sendStatus(204) :
        res.sendStatus(404)
})

appRouter.delete('/blogs/:id', validAuthorize, validId, (req: Request, res: Response) => {
    postsRepository.deletePostById(req.params.id) ?
        res.sendStatus(204) :
        res.sendStatus(404)
})