import {Request, Response, Router} from 'express';
import {postsRepositoryQuery} from "../../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";
import {blogsPaginatorDefault} from "../../middlewares/blogs-middlewares";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";
import {checkPostByPostId} from "../../middlewares/posts-middlewares";
import {jwtService} from "../../applications/jwt-service";
import {postHandlers} from "./post-handler";
import {InputPostsPagingType} from "../../types/posts-types";
import {commentHandler} from "../comments/comments-handlers";
import {commentsRepositoryQuery} from "../../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {constants} from "http2";

export const postRouterQuery = Router({})

postRouterQuery.get('/', blogsPaginatorDefault, async (req: Request, res: Response) => {

    const headersAuth = req.headers.authorization
    const postsTotalCount = await postsRepositoryQuery.getPostsTotalCount()
    const query = req.query as InputPostsPagingType
    const postsPagingFromDB = await postsRepositoryQuery.getPostsWithPaging(query)

    if (headersAuth) {

        const payLoad = await jwtService.getPayloadAccessToken(headersAuth)

        if (payLoad) {

            const postViewPagingModel = postHandlers
                .createPostPagingViewModelNew(postsTotalCount, postsPagingFromDB, query, payLoad.userId)

            return res.status(constants.HTTP_STATUS_OK).send(postViewPagingModel)
        }
    }

    const postViewPagingModel = postHandlers
        .createPostPagingViewModelNew(postsTotalCount, postsPagingFromDB, query)

    return res.status(constants.HTTP_STATUS_OK).send(postViewPagingModel)
})

postRouterQuery.get('/:id', async (req: Request, res: Response) => {

    const postId = req.params.id
    const headersAuth = req.headers.authorization
    const postFromDB = await postsRepositoryQuery.getPostById(postId)

    if (!postFromDB) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

    if (headersAuth) {

        const payLoad = await jwtService.getPayloadAccessToken(headersAuth)

        if (payLoad) {

            const postViewModel = postHandlers
                .createPostViewModelNew(postFromDB, payLoad.userId)

            return res.status(constants.HTTP_STATUS_OK).send(postViewModel)
        }
    }

    const postViewModel = postHandlers.createPostViewModelNew(postFromDB)

    return res.status(constants.HTTP_STATUS_OK).send(postViewModel)
})

postRouterQuery.get('/:postId/comments',
    checkPostByPostId,
    usersPaginatorDefault,
    async (req: Request, res: Response) => {

        const query = req.query
        const postId = req.params.postId
        const headersAuth = req.headers.authorization
        const totalComment = await commentsRepositoryQuery.getTotalCommentsByPostId(postId)
        const commentsPaging = await commentsRepositoryQuery.getCommentsByPostId(postId, query)

        if (headersAuth) {

            const payload = await jwtService.getPayloadAccessToken(headersAuth)

            if (payload) {

                const commentsPagingViewModel = await commentHandler
                    .paginatorCommentViewModel(postId, query, totalComment, commentsPaging, payload.userId)

                return res.status(constants.HTTP_STATUS_OK).send(commentsPagingViewModel)
            }
        }

        const commentsPagingViewModel = await commentHandler
            .paginatorCommentViewModel(postId, query, totalComment, commentsPaging)

        return res.status(constants.HTTP_STATUS_OK).send(commentsPagingViewModel)
    })