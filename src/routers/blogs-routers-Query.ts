import {Request, Response, Router} from 'express';
import {blogsRepositoryQuery} from "../repositories/mongodb-repository/blogs-mongodb-Query";
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb";
import {blogsPaginatorDefault} from "../middlewares/blogs-middlewares";

export const blogRouterQuery = Router ({})

blogRouterQuery.get( '/blogs', blogsPaginatorDefault, async (req: Request, res: Response) => {

    return res.status(200).send(await blogsRepositoryQuery.getBlogsWithPaging(req.query))
})

blogRouterQuery.get( '/blogs/:blogId/posts', blogsPaginatorDefault, async (req: Request, res: Response) => {

    const postsByBlogId = await blogsRepositoryQuery.getPostsByBlogId(req.params.blogId, req.query)
    if (postsByBlogId) return res.status(200).send(postsByBlogId)
    return res.sendStatus(404)
})

blogRouterQuery.get( '/blogs/:id', async (req: Request, res: Response) => {

    const blogs = await blogsRepository.getBlogById(req.params.id)
    if (blogs) return res.status(200).send(blogs)
    return res.sendStatus(404)
})