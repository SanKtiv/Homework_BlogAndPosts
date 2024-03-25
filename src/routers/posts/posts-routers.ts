import {Request, Response, Router} from 'express';
import {validId} from "../../validations/blogs-validators";
import {validPostBlogId} from "../../validations/posts-validators";
import {checkPostByPostId} from "../../middlewares/posts-middlewares";
import {commentsValidation} from "../../validations/comments-validators";
import {authorizationMiddleware} from "../../middlewares/authorization-jwt";
import {errorMiddleware} from "../../middlewares/error-validators-middleware";
import {basicAuth} from "../../middlewares/authorization-basic";
import {CommentsService} from "../../services/comments-service";
import {PostsQueryRepository} from "../../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";
import {PostsService} from "../../services/posts-service";
import {likeStatusBody} from "../../validations/like-status-validation";
import {BlogsRepositoryQuery} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";
import {constants} from "http2";
import {PostsHandler} from "./post-handler";
import {CommentsHandler} from "../comments/comments-handlers";

export const postRouter = Router({})

class PostsController {

    private blogsRepositoryQuery: BlogsRepositoryQuery
    private postsService: PostsService
    private commentService: CommentsService
    private commentsHandler: CommentsHandler
    private postsQueryRepository: PostsQueryRepository
    private postsHandler: PostsHandler

    constructor() {

        this.blogsRepositoryQuery = new BlogsRepositoryQuery()
        this.postsService = new PostsService()
        this.commentService = new CommentsService()
        this.commentsHandler = new CommentsHandler()
        this.postsQueryRepository = new PostsQueryRepository()
        this.postsHandler = new PostsHandler()
    }

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

        const commentDB = await this.commentService
            .createCommentForPost(postId, content, userId, userLogin)

        const commentViewModel = await this.commentsHandler.createCommentViewModel(commentDB)

        res.status(constants.HTTP_STATUS_CREATED).send(commentViewModel)
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

const postsController = new PostsController()

postRouter.post('/',
    validPostBlogId,
    basicAuth,
    errorMiddleware.error.bind(errorMiddleware),
    postsController.createPost.bind(postsController))

postRouter.post('/:postId/comments',
    authorizationMiddleware.accessToken.bind(authorizationMiddleware),
    //commentsValidation.postId.bind(commentsValidation),
    //commentsValidation.content.bind(commentsValidation),
    checkPostByPostId,
    errorMiddleware.error.bind(errorMiddleware),
    postsController.createCommentForPost.bind(postsController))

postRouter.put('/:id',
    validPostBlogId,
    basicAuth,
    validId,
    errorMiddleware.error.bind(errorMiddleware),
    postsController.updatePost.bind(postsController))

postRouter.put('/:postId/like-status',
    authorizationMiddleware.accessToken.bind(authorizationMiddleware),
    likeStatusBody,
    errorMiddleware.error.bind(errorMiddleware),
    postsController.createLikeStatusForPost.bind(postsController))

postRouter.delete('/:id',
    basicAuth,
    validId,
    postsController.deletePostById.bind(postsController))

// postRouter.post('/',
//     validPostBlogId,
//     basicAuth,
//     errorsOfValidate,
//     async (req: Request, res: Response) => {
//
//         const blogDB = await blogsRepositoryQuery.getBlogById(req.body.blogId)
//
//         const post = await postsService.createPost(req.body, blogDB!.name)
//
//         return res.status(constants.HTTP_STATUS_CREATED).send(post)
//     })
//
// postRouter.post('/:postId/comments',
//     authAccessToken,
//     checkInputFormComment,
//     checkPostByPostId,
//     errorsOfValidate,
//     async (req: Request, res: Response) => {
//
//         const postId = req.params.postId
//         const content = req.body.content
//         const userId = req.user!.userId
//         const userLogin = req.user!.login
//
//         const comment = await commentService
//             .createCommentForPost(postId, content, userId, userLogin)
//
//         res.status(constants.HTTP_STATUS_CREATED).send(comment)
//     })
//
// postRouter.put('/:id',
//     validPostBlogId,
//     basicAuth,
//     validId,
//     errorsOfValidate,
//     async (req: Request, res: Response) => {
//
//         const postIsUpdate = await postsRepository.updatePost(req.params.id, req.body)
//
//         if (postIsUpdate) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//
//         return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
//     })
//
// postRouter.put('/:postId/like-status',
//     authAccessToken,
//     likeStatusBody,
//     errorsOfValidate,
//     async (req: Request, res: Response) => {
//
//     const dataBody = {
//         id: req.params.postId,
//         likeStatus: req.body.likeStatus,
//         userId: req.user!.userId,
//         login: req.user!.login,
//     }
//
//     const likesInfo = await postsQueryRepository.getLikesInfoByPostId(dataBody.id)
//
//     if (!likesInfo) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
//
//     const userLikeStatus = await postsQueryRepository
//         .getPostUserLikeStatusByPostId(dataBody.id, dataBody.userId)
//
//     if (!userLikeStatus) {
//         await postsService
//             .addLikesInfoInPost(dataBody, likesInfo.extendedLikesInfo)
//
//         return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//     }
//
//     const userStatus = userLikeStatus.userLikesInfo[0].userStatus
//
//     if (userStatus === dataBody.likeStatus) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//
//     await postsService
//         .changeLikesInfoInPost(dataBody, likesInfo.extendedLikesInfo, userStatus)
//
//     return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
// })
//
// postRouter.delete('/:id',
//     basicAuth,
//     validId,
//     async (req: Request, res: Response) => {
//
//         const postIsDelete = await postsRepository.deletePostById(req.params.id)
//
//         if (postIsDelete) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//
//         return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
//     })