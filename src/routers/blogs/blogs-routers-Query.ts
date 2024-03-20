import {Request, Response, Router} from 'express';
import {blogsRepositoryQuery} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";
import {blogsPaginatorDefault} from "../../middlewares/blogs-middlewares";
import {InputPostsPagingType} from "../../types/posts-types";
import {InputBlogsPagingType} from "../../types/blogs-types";
import {dbPostsCollection} from "../../repositories/mongodb-repository/db";
import {postHandlers} from "../posts/post-handler";
import {jwtService} from "../../applications/jwt-service";
import {blogHandlers} from "./blog-handlers";
import {constants} from "http2";

export const blogRouterQuery = Router({})

blogRouterQuery.get('/', blogsPaginatorDefault, async (req: Request, res: Response) => {

    const query = req.query as InputBlogsPagingType

    const totalBlogs = query.searchNameTerm ?
        await blogsRepositoryQuery.getTotalBlogsByName(query.searchNameTerm) :
        await blogsRepositoryQuery.getTotalBlogs()

    const blogsPagingDB = await blogsRepositoryQuery.getBlogsWithPaging(query)

    const blogsPagingView = await blogHandlers
        .blogPagingViewModel(totalBlogs, blogsPagingDB, query)

    res.status(constants.HTTP_STATUS_OK).send(blogsPagingView)
})

blogRouterQuery.get('/:blogId/posts', blogsPaginatorDefault, async (req: Request, res: Response) => {

    const blogId = req.params.blogId

    const headersAuth = req.headers.authorization

    const query = req.query as InputPostsPagingType

    const totalPostsByBlogId = await dbPostsCollection.countDocuments({blogId: blogId})

    const postsByBlogId = await blogsRepositoryQuery.getPostsByBlogId(blogId, query)

    if (!postsByBlogId.length) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

    if (headersAuth) {

        const payLoad = await jwtService.getPayloadAccessToken(headersAuth)

        if (payLoad) {

            const postPagingViewModel = await postHandlers
                .createPostPagingViewModelNew(totalPostsByBlogId, postsByBlogId, query, payLoad.userId)

            return res.status(constants.HTTP_STATUS_OK).send(postPagingViewModel)
        }
    }

    const postPagingViewModel = await postHandlers
        .createPostPagingViewModelNew(totalPostsByBlogId, postsByBlogId, query)

    return res.status(constants.HTTP_STATUS_OK).send(postPagingViewModel)
})

blogRouterQuery.get('/:id', async (req: Request, res: Response) => {

    const blogDB = await blogsRepositoryQuery.getBlogById(req.params.id)

    if (!blogDB) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

    const blog = await blogHandlers.blogViewModel(blogDB)

    return res.status(constants.HTTP_STATUS_OK).send(blog)
})