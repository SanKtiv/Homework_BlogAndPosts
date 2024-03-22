import {Request, Response, Router} from 'express';
import {
    PostsQueryRepository,
    postsQueryRepository
} from "../../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";
import {blogsPaginatorDefault} from "../../middlewares/blogs-middlewares";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";
import {checkPostByPostId} from "../../middlewares/posts-middlewares";
import {JwtService, jwtService} from "../../applications/jwt-service";
import {PostsHandler, postsHandler} from "./post-handler";
import {InputPostsPagingType} from "../../types/posts-types";
import {commentsHandler} from "../comments/comments-handlers";
import {commentsQueryRepository} from "../../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {constants} from "http2";

export const postRouterQuery = Router({})

class PostsQueryController {

    private postsQueryRepository: PostsQueryRepository
    private jwtService: JwtService
    private postsHandler: PostsHandler

    constructor() {

        this.postsQueryRepository = new PostsQueryRepository()
        this.jwtService = new JwtService()
        this.postsHandler = new PostsHandler()
    }

    async getPostsPaging(req: Request, res: Response) {

        const headersAuth = req.headers.authorization
        const postsTotalCount = await this.postsQueryRepository.getPostsTotalCount()
        const query = req.query as InputPostsPagingType
        const postsPagingFromDB = await this.postsQueryRepository.getPostsWithPaging(query)

        if (headersAuth) {

            const payLoad = await this.jwtService.getPayloadAccessToken(headersAuth)

            if (payLoad) {

                const postViewPagingModel = this.postsHandler
                    .createPostPagingViewModel(postsTotalCount, postsPagingFromDB, query, payLoad.userId)

                return res.status(constants.HTTP_STATUS_OK).send(postViewPagingModel)
            }
        }

        const postViewPagingModel = this.postsHandler
            .createPostPagingViewModel(postsTotalCount, postsPagingFromDB, query)

        return res.status(constants.HTTP_STATUS_OK).send(postViewPagingModel)
    }

    async getPostById(req: Request, res: Response) {

        const postId = req.params.id
        const headersAuth = req.headers.authorization
        const postFromDB = await this.postsQueryRepository.getPostById(postId)

        if (!postFromDB) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

        if (headersAuth) {

            const payLoad = await this.jwtService.getPayloadAccessToken(headersAuth)

            if (payLoad) {

                const postViewModel = this.postsHandler
                    .createPostViewModel(postFromDB, payLoad.userId)

                return res.status(constants.HTTP_STATUS_OK).send(postViewModel)
            }
        }

        const postViewModel = this.postsHandler.createPostViewModel(postFromDB)

        return res.status(constants.HTTP_STATUS_OK).send(postViewModel)
    }

    async getCommentsByPostId(req: Request, res: Response) {

        const query = req.query
        const postId = req.params.postId
        const headersAuth = req.headers.authorization
        const totalComment = await commentsQueryRepository.getTotalCommentsByPostId(postId)
        const commentsPaging = await commentsQueryRepository.getCommentsByPostId(postId, query)

        if (headersAuth) {

            const payload = await this.jwtService.getPayloadAccessToken(headersAuth)

            if (payload) {

                const commentsPagingViewModel = await commentsHandler
                    .paginatorCommentViewModel(postId, query, totalComment, commentsPaging, payload.userId)

                return res.status(constants.HTTP_STATUS_OK).send(commentsPagingViewModel)
            }
        }

        const commentsPagingViewModel = await commentsHandler
            .paginatorCommentViewModel(postId, query, totalComment, commentsPaging)

        return res.status(constants.HTTP_STATUS_OK).send(commentsPagingViewModel)
    }
}

postRouterQuery.get('/', blogsPaginatorDefault, async (req: Request, res: Response) => {

    const headersAuth = req.headers.authorization
    const postsTotalCount = await postsQueryRepository.getPostsTotalCount()
    const query = req.query as InputPostsPagingType
    const postsPagingFromDB = await postsQueryRepository.getPostsWithPaging(query)

    if (headersAuth) {

        const payLoad = await jwtService.getPayloadAccessToken(headersAuth)

        if (payLoad) {

            const postViewPagingModel = postsHandler
                .createPostPagingViewModel(postsTotalCount, postsPagingFromDB, query, payLoad.userId)

            return res.status(constants.HTTP_STATUS_OK).send(postViewPagingModel)
        }
    }

    const postViewPagingModel = postsHandler
        .createPostPagingViewModel(postsTotalCount, postsPagingFromDB, query)

    return res.status(constants.HTTP_STATUS_OK).send(postViewPagingModel)
})

postRouterQuery.get('/:id', async (req: Request, res: Response) => {

    const postId = req.params.id
    const headersAuth = req.headers.authorization
    const postFromDB = await postsQueryRepository.getPostById(postId)

    if (!postFromDB) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

    if (headersAuth) {

        const payLoad = await jwtService.getPayloadAccessToken(headersAuth)

        if (payLoad) {

            const postViewModel = postsHandler
                .createPostViewModel(postFromDB, payLoad.userId)

            return res.status(constants.HTTP_STATUS_OK).send(postViewModel)
        }
    }

    const postViewModel = postsHandler.createPostViewModel(postFromDB)

    return res.status(constants.HTTP_STATUS_OK).send(postViewModel)
})

postRouterQuery.get('/:postId/comments',
    checkPostByPostId,
    usersPaginatorDefault,
    async (req: Request, res: Response) => {

        const query = req.query
        const postId = req.params.postId
        const headersAuth = req.headers.authorization
        const totalComment = await commentsQueryRepository.getTotalCommentsByPostId(postId)
        const commentsPaging = await commentsQueryRepository.getCommentsByPostId(postId, query)

        if (headersAuth) {

            const payload = await jwtService.getPayloadAccessToken(headersAuth)

            if (payload) {

                const commentsPagingViewModel = await commentsHandler
                    .paginatorCommentViewModel(postId, query, totalComment, commentsPaging, payload.userId)

                return res.status(constants.HTTP_STATUS_OK).send(commentsPagingViewModel)
            }
        }

        const commentsPagingViewModel = await commentsHandler
            .paginatorCommentViewModel(postId, query, totalComment, commentsPaging)

        return res.status(constants.HTTP_STATUS_OK).send(commentsPagingViewModel)
    })