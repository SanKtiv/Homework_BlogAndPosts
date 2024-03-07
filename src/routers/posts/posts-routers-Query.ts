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

    const headersAuth = req.headers.authorization
    const postsTotalCount = await postsRepositoryQuery.getPostsTotalCount()

    if (headersAuth) {

        const payLoad = await jwtService.getPayloadAccessToken(headersAuth)

        if (payLoad) {

            const postsPagingFromDB = await postsRepositoryQuery
                .getPostsWithPagingLikes(req.query)

            const usersStatuses = await postsRepositoryQuery
                .getUsersStatusesByUserId(payLoad.userId)

            const postViewPagingModel = postHandlers
                .createPostPagingViewModel(postsTotalCount,
                    postsPagingFromDB,
                    req.query as InputPostsPagingType,
                    usersStatuses!)

            // console.log('postViewPagingModel =', postViewPagingModel)
            // console.log('0 =', postViewPagingModel.items[0].extendedLikesInfo)
            // console.log('1 =', postViewPagingModel.items[1].extendedLikesInfo)
            // console.log('2 =', postViewPagingModel.items[2].extendedLikesInfo)
            // console.log('3 =', postViewPagingModel.items[3].extendedLikesInfo)
            // console.log('4 =', postViewPagingModel.items[4].extendedLikesInfo)

            return res.status(200).send(postViewPagingModel)
        }
    }

    const postsPagingFromDB = await postsRepositoryQuery
        .getPostsWithPagingLikes(req.query)
    // console.log('postsPagingFromDB =', postsPagingFromDB)

    const postViewPagingModel = postHandlers
                    .createPostPagingViewModel(postsTotalCount,
                        postsPagingFromDB,
                        req.query as InputPostsPagingType)

    return res.status(200).send(postViewPagingModel)
})

postRouterQuery.get( '/:id', async (req: Request, res: Response) => {

    const postId = req.params.id
    const headersAuth = req.headers.authorization

    const postFromDB = await postsRepositoryQuery.getPostById(postId)

    if (!postFromDB) return res.sendStatus(404)

    if (headersAuth) {

        const payLoad = await jwtService.getPayloadAccessToken(headersAuth)

        if (payLoad) {

            const userStatus = await postsRepositoryQuery
                .getUserStatusByPostIdAndUserId(postId, payLoad.userId)

            const myStatus = userStatus ? userStatus.userLikesInfo[0].userStatus : 'None'

            const postByPostId = await postsRepositoryQuery
                .getPostWithLikesByPostID(postId)
            //console.log('postDBByPostId =', postByPostId)

            const postViewModel = postHandlers.createPostViewModel(postByPostId, myStatus)
             console.log('access token postViewModel =', postViewModel)
            console.log('newestLikes =', postViewModel.extendedLikesInfo.newestLikes)
            return res.status(200).send(postViewModel)
        }
    }

    const postByPostId = await postsRepositoryQuery
        .getPostWithLikesByPostID(postId)

    const postViewModel = postHandlers.createPostViewModel(postByPostId, 'None')
    console.log('postViewModel =', postViewModel)
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