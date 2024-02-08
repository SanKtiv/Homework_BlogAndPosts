import {Request, Response, Router} from 'express';
import {blogsRepositoryQuery} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";
import {blogsRepository} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";
import {blogsPaginatorDefault} from "../../middlewares/blogs-middlewares";
import {InputPostsPagingType} from "../../types/posts-types";
import {InputBlogsPagingType} from "../../types/blogs-types";

export const blogRouterQuery = Router ({})

blogRouterQuery.get( '/', blogsPaginatorDefault, async (req: Request, res: Response) => {

    const blogsPaging = await blogsRepositoryQuery.getBlogsWithPaging(req.query as InputBlogsPagingType)
    res.status(200).send(blogsPaging)
})

blogRouterQuery.get( '/:blogId/posts', blogsPaginatorDefault, async (req: Request, res: Response) => {

    const postsByBlogId = await blogsRepositoryQuery.getPostsByBlogId(req.params.blogId, req.query as InputPostsPagingType)
    if (postsByBlogId) return res.status(200).send(postsByBlogId)
    return res.sendStatus(404)
})

blogRouterQuery.get( '/:id', async (req: Request, res: Response) => {

    const blogs = await blogsRepository.getBlogById(req.params.id)
    if (blogs) return res.status(200).send(blogs)
    return res.sendStatus(404)
})