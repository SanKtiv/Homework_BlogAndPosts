import {BlogsQueryRepository} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";
import {PostsService} from "../../services/posts-service";
import {CommentsService} from "../../services/comments-service";
import {CommentsHandler} from "../comments/comments-handlers";
import {PostsQueryRepository} from "../../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";
import {PostsHandler} from "./post-handler";
import {JwtService} from "../../applications/jwt-service";
import {CommentsQueryRepository} from "../../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {Request, Response} from "express";
import {constants} from "http2";
import {InputPostsPagingType} from "../../types/posts-types";

export class PostsController {

    constructor(protected blogsRepositoryQuery: BlogsQueryRepository,
                protected postsService: PostsService,
                protected commentsService: CommentsService,
                protected commentsHandler: CommentsHandler,
                protected postsQueryRepository: PostsQueryRepository,
                protected postsHandler: PostsHandler,
                protected jwtService: JwtService,
                protected commentsQueryRepository: CommentsQueryRepository) {}

    async createPost(req: Request, res: Response) {

        const blogDB = await this.blogsRepositoryQuery.getBlogById(req.body.blogId)

        const postDB = await this.postsService.createPost(req.body, blogDB!.name)

        const postViewModel = await this.postsHandler.createPostViewModel(postDB)

        return res.status(constants.HTTP_STATUS_CREATED).send(postViewModel)
    }

    async createCommentForPost(req: Request, res: Response) {

        const postId = req.params.postId
        const content = req.body.content
        const userId = req.user!.userId
        const userLogin = req.user!.login

        const commentDB = await this.commentsService
            .createCommentForPost(postId, content, userId, userLogin)

        const commentViewModel = await this.commentsHandler.createCommentViewModel(commentDB)

        res.status(constants.HTTP_STATUS_CREATED).send(commentViewModel)
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
        const totalComment = await this.commentsQueryRepository.getTotalCommentsByPostId(postId)
        const commentsPaging = await this.commentsQueryRepository.getCommentsByPostId(postId, query)

        if (headersAuth) {

            const payload = await this.jwtService.getPayloadAccessToken(headersAuth)

            if (payload) {

                const commentsPagingViewModel = await this.commentsHandler
                    .paginatorCommentViewModel(postId, query, totalComment, commentsPaging, payload.userId)

                return res.status(constants.HTTP_STATUS_OK).send(commentsPagingViewModel)
            }
        }

        const commentsPagingViewModel = await this.commentsHandler
            .paginatorCommentViewModel(postId, query, totalComment, commentsPaging)

        return res.status(constants.HTTP_STATUS_OK).send(commentsPagingViewModel)
    }

    async updatePost(req: Request, res: Response) {

        const postIsUpdate = await this.postsService.updatePost(req.params.id, req.body)

        if (postIsUpdate) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)

        return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
    }

    async createLikeStatusForPost(req: Request, res: Response) {

        const dataBody = {
            id: req.params.postId,
            likeStatus: req.body.likeStatus,
            userId: req.user!.userId,
            login: req.user!.login,
        }

        const likesInfo = await this.postsQueryRepository.getLikesInfoByPostId(dataBody.id)
console.log('likesInfo =', likesInfo)
        if (!likesInfo) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

        const userLikeStatus = await this.postsQueryRepository
            .getPostUserLikeStatusByPostId(dataBody.id, dataBody.userId)

        if (!userLikeStatus) {

            await this.postsService
                .addLikesInfoInPost(dataBody, likesInfo.extendedLikesInfo)

            return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
        }

        const userStatus = userLikeStatus.userLikesInfo[0].userStatus

        if (userStatus === dataBody.likeStatus) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)

        await this.postsService
            .changeLikesInfoInPost(dataBody, likesInfo.extendedLikesInfo, userStatus)

        return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async deletePostById(req: Request, res: Response) {

        const postIsDelete = await this.postsService.deletePostById(req.params.id)

        if (postIsDelete) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)

        return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
    }
}