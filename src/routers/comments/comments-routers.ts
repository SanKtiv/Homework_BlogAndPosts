import {Router, Response, Request} from "express";
import {commentsValidation} from "../../validations/comments-validators";
import {commentsMiddleware} from "../../middlewares/comment-middleware";
import {CommentsService} from "../../services/comments-service";
import {authorizationMiddleware} from "../../middlewares/authorization-jwt";
import {errorMiddleware} from "../../middlewares/errors-middleware";
import {JwtService} from "../../applications/jwt-service";
import {likeStatusValidation} from "../../validations/like-status-validation";
import {CommentsQueryRepository} from "../../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {CommentsHandler} from "./comments-handlers";
import {constants} from "http2";
import {commentsController} from "../../composition-root";

export const commentRouter = Router({})

export class CommentsController {

    constructor(protected commentsQueryRepository: CommentsQueryRepository,
                protected jwtService: JwtService,
                protected commentsHandler: CommentsHandler,
                protected commentsService: CommentsService) {}

    async getCommentById(req: Request, res: Response) {

        const id = req.params.id

        const authorization = req.headers.authorization

        const commentDB = await this.commentsQueryRepository.getCommentById(id)

        if (!commentDB) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

        if (authorization) {

            const payload = await this.jwtService.getPayloadAccessToken(authorization)

            if (payload) {

                const viewModel = this.commentsHandler.createCommentViewModel(commentDB, payload.userId)

                return res.status(constants.HTTP_STATUS_OK).send(viewModel)
            }
        }

        const commentViewModel = this.commentsHandler.createCommentViewModel(commentDB)

        return res.status(constants.HTTP_STATUS_OK).send(commentViewModel)
    }

    async updateCommentById(req: Request, res: Response) {

        const id = req.params.commentId
        const content = req.body.content

        await this.commentsService.updateCommentContentById(id, content)

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async updateCommentLikeStatusById(req: Request, res: Response) {

        const commentId = req.params.commentId
        const likeStatus = req.body.likeStatus
        const userId = req.user!.userId
        const commentDB = await this.commentsQueryRepository.getCommentById(commentId)

        await this.commentsService
            .addOrChangeLikesInfo(commentDB!, userId, likeStatus)

        return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async deleteCommentById(req: Request, res: Response) {

        await this.commentsService.deleteCommentById(req.params.commentId)

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }
}

commentRouter.get('/:id',
    commentsValidation.id.bind(commentsValidation),
    commentsController.getCommentById.bind(commentsController))

commentRouter.put('/:commentId',
    authorizationMiddleware.accessToken.bind(authorizationMiddleware),
    commentsValidation.commentId.bind(commentsValidation),
    errorMiddleware.error.bind(errorMiddleware),
    commentsMiddleware.commentOwner.bind(commentsMiddleware),
    commentsController.updateCommentById.bind(commentsController))

commentRouter.put('/:commentId/like-status',
    authorizationMiddleware.accessToken.bind(authorizationMiddleware),
    commentsMiddleware.commentId.bind(commentsMiddleware),
    likeStatusValidation.likeStatus.bind(likeStatusValidation),
    errorMiddleware.error.bind(errorMiddleware),
    commentsController.updateCommentLikeStatusById.bind(commentsController))

commentRouter.delete('/:commentId',
    authorizationMiddleware.accessToken.bind(authorizationMiddleware),
    commentsMiddleware.commentOwner.bind(commentsMiddleware),
    commentsController.deleteCommentById.bind(commentsController))

// commentRouter.get('/:id', checkId, async (req: Request, res: Response) => {
//
//     const id = req.params.id
//     const authorization = req.headers.authorization
//     const commentDB = await commentsQueryRepository.getCommentById(id)
//
//     if (!commentDB) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
//
//     if (authorization) {
//
//         const payload = await jwtService.getPayloadAccessToken(authorization)
//
//         if (payload) {
//
//             const viewModel = commentsHandler.createCommentViewModel(commentDB, payload.userId)
//
//             return res.status(constants.HTTP_STATUS_OK).send(viewModel)
//         }
//     }
//
//     const viewModel = commentsHandler.createCommentViewModel(commentDB)
//
//     return res.status(constants.HTTP_STATUS_OK).send(viewModel)
// })
//
// commentRouter.put('/:commentId',
//     authAccessToken,
//     checkCommentModelForUpdate,
//     errorsOfValidate,
//     checkOwnCommentById,
//     async (req: Request, res: Response) => {
//
//         const id = req.params.commentId
//         const content = req.body.content
//
//         await commentService.updateCommentContentById(id, content)
//
//         res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//     })
//
// commentRouter.put('/:commentId/like-status',
//     authAccessToken,
//     checkCommentById,
//     likeStatusBody,
//     errorsOfValidate,
//     async (req: Request, res: Response) => {
//
//         const commentId = req.params.commentId
//         const likeStatus = req.body.likeStatus
//         const userId = req.user!.userId
//         const commentDB = await commentsQueryRepository.getCommentById(commentId)
//
//         await commentService
//             .addOrChangeLikesInfo(commentDB!, userId, likeStatus)
//
//         return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//     })
//
// commentRouter.delete('/:commentId',
//     authAccessToken,
//     checkOwnCommentById,
//     async (req: Request, res: Response) => {
//
//         await commentsRepository.deleteCommentById(req.params.commentId)
//
//         res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//     })