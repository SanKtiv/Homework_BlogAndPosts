import {Request, Response, Router} from 'express';
import {blogsRepositoryQuery} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";
import {blogsRepository} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";
import {blogsPaginatorDefault} from "../../middlewares/blogs-middlewares";
import {InputPostsPagingType} from "../../types/posts-types";
import {InputBlogsPagingType} from "../../types/blogs-types";
import {dbPostsCollection} from "../../repositories/mongodb-repository/db";
import {postHandlers} from "../posts/post-handler";
import {jwtService} from "../../applications/jwt-service";

export const blogRouterQuery = Router ({})

blogRouterQuery.get( '/', blogsPaginatorDefault, async (req: Request, res: Response) => {

    const blogsPaging = await blogsRepositoryQuery
        .getBlogsWithPaging(req.query as InputBlogsPagingType)

    res.status(200).send(blogsPaging)
})

blogRouterQuery.get( '/:blogId/posts', blogsPaginatorDefault, async (req: Request, res: Response) => {

    const blogId = req.params.blogId

    const headersAuth = req.headers.authorization

    const query = req.query as InputPostsPagingType

    const totalPostsByBlogId = await dbPostsCollection.countDocuments({blogId: blogId})

    const postsByBlogId = await blogsRepositoryQuery.getPostsByBlogId(blogId, query)

    if (!postsByBlogId) return res.sendStatus(404)

    if (headersAuth) {

        const payLoad = await jwtService.getPayloadAccessToken(headersAuth)

        if (payLoad) {

            const view = await postHandlers
                .createPostPagingViewModelNew(totalPostsByBlogId, postsByBlogId, query, payLoad.userId)

            return res.status(200).send(view)
        }
    }

    const view = await postHandlers
        .createPostPagingViewModelNew(totalPostsByBlogId, postsByBlogId, query)

    return res.status(200).send(view)
})

blogRouterQuery.get( '/:id', async (req: Request, res: Response) => {

    const blogs = await blogsRepository.getBlogById(req.params.id)

    if (blogs) return res.status(200).send(blogs)

    return res.sendStatus(404)
})