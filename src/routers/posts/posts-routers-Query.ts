import {Request, Response, Router} from 'express';
import {postsRepositoryQuery} from "../../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";
import {blogsPaginatorDefault} from "../../middlewares/blogs-middlewares";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";
import {checkPostByPostId} from "../../middlewares/posts-middlewares";
import {jwtService} from "../../applications/jwt-service";
import {postHandlers} from "./post-handler";
import {InputPostsPagingType} from "../../types/posts-types";
import {commentHandlers} from "../comments/comments-handlers";
import {commentsRepositoryQuery} from "../../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";

export const postRouterQuery = Router ({})

postRouterQuery.get( '/', blogsPaginatorDefault, async (req: Request, res: Response) => {

    const postsTotalCount = await postsRepositoryQuery.getPostsTotalCount()

    const postsPagingFromDB = await postsRepositoryQuery.getPostsWithPaging(req.query)

    const postPagingViewModel = postHandlers
        .createPostPagingViewModel(postsTotalCount, postsPagingFromDB, req.query as InputPostsPagingType)

    return res.status(200).send(postPagingViewModel)
})

postRouterQuery.get( '/:id', async (req: Request, res: Response) => {

    const postId = req.params.id
    const headersAuth = req.headers.authorization

    const postFromDB = await postsRepositoryQuery.getPostById(postId)

    if (!postFromDB) return res.sendStatus(404)

    if (headersAuth) {

        const payLoad = await jwtService.getPayloadAccessToken(headersAuth)

        if (payLoad) {

            const postFromDBWithUserLikeStatus = await postsRepositoryQuery
                .getPostWithUserStatusByPostId(postId, payLoad.userId)
            console.log('userLikesInfo =', postFromDBWithUserLikeStatus)

            const postDBSortByAddedAt = await postsRepositoryQuery
                .getPostWithLikeStatusInfoByPostId(postId)
            console.log('postDBSortByAddedAt =', postDBSortByAddedAt)
        }
    }

    const postViewModel = postHandlers.createPostViewModel(postFromDB)

    return res.status(200).send(postViewModel)
})

postRouterQuery.get('/:postId/comments',
    checkPostByPostId,
    usersPaginatorDefault,
    async (req: Request, res: Response) => {

        const postId = req.params.postId
        const query = req.query

        const totalComment = await commentsRepositoryQuery.getTotalCommentsByPostId(postId)

        const commentsPaging = await commentsRepositoryQuery.getCommentsByPostId(postId, query)

        if (!req.headers.authorization) {

            const paginatorCommentViewModel = await commentHandlers
                .paginatorCommentViewModel(postId, query, totalComment, commentsPaging)

            return res.status(200).send(paginatorCommentViewModel)
        }

        const payload = await jwtService.getPayloadAccessToken(req.headers.authorization)

        if (!payload) {

            const paginatorCommentViewModel = await commentHandlers
                .paginatorCommentViewModel(postId, query, totalComment, commentsPaging)

            return res.status(200).send(paginatorCommentViewModel)
        }

        const paginatorCommentViewModel = await commentHandlers
            .paginatorCommentViewModel(postId, query, totalComment, commentsPaging, payload.userId)

        return res.status(200).send(paginatorCommentViewModel)
    })