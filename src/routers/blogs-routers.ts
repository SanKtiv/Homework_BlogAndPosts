import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb";
import {
    validId,
    validAuthorize,
    errorsOfValidation,
    validBlogIdParam,
    validateBlog,
    validTitle, validShortDescription, validContent
} from "../validations/validations";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb";

export const blogRouter = Router ({})

// blogRouter.get( '/', async (req: Request, res: Response) => {
//     //console.log(Object.keys(req.query).length)
//     if (Object.keys(req.query).length) {
//         return res.status(200).send(await blogsRepositoryQuery.getBlogsWithPaging(req.query))
//     }
//     return res.status(200).send(await blogsRepository.getAllBlogs())
// })
//
// blogRouter.get( '/:id', async (req: Request, res: Response) => {
//     const blogs = await blogsRepository.getBlogById(req.params.id)
//     if (blogs) return res.status(200).send(blogs)
//     return res.sendStatus(404)
// })

blogRouter.post( '/blogs', validateBlog(), validAuthorize, errorsOfValidation, async (req: Request, res: Response) => {
    const blog = await blogsRepository.createBlog(req.body)
    return res.status(201).send(blog)
})

blogRouter.post( '/blogs/:blogId/posts', validTitle, validShortDescription, validContent, validAuthorize, validBlogIdParam, errorsOfValidation, async (req: Request, res: Response) => {
    const post = await postsRepository.createPostForBlogId(req.params.blogId, req.body)
    return res.status(201).send(post)
})

blogRouter.put('/blogs/:id', validateBlog(), validAuthorize, validId, validBlogIdParam, errorsOfValidation, async (req: Request, res: Response) => {
    const blogIsUpdate = await blogsRepository.updateBlog(req.params.id, req.body)
    if (blogIsUpdate) return res.sendStatus(204)
    return res.sendStatus(404)
})

blogRouter.delete('/blogs/:id', validAuthorize, validId, async (req: Request, res: Response) => {
    const blogIsDelete = await blogsRepository.deleteBlogById(req.params.id)
    if (blogIsDelete) return res.sendStatus(204)
    return res.sendStatus(404)
})