import {Router, Response, Request} from "express";
import {checkCommentModelForUpdate, checkId} from "../../validations/comments-validators";
import {checkCommentById, checkOwnCommentById} from "../../middlewares/comment-middleware";
import {commentsRepository} from "../../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {commentService} from "../../services/comments-service";
import {authAccessToken} from "../../middlewares/authorization-jwt";
import {errorsOfValidate} from "../../middlewares/error-validators-middleware";
import {jwtService} from "../../applications/jwt-service";
import {likeStatusBody} from "../../validations/like-status-validation";
import {commentsRepositoryQuery} from "../../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {commentHandler} from "./comments-handlers";
import {constants} from "http2";


export const commentRouter = Router({})

commentRouter.get('/:id', checkId, async (req: Request, res: Response) => {

    const id = req.params.id
    const authorization = req.headers.authorization

    const commentDB = await commentsRepositoryQuery.getCommentById(id)

    if (!commentDB) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

    if (authorization) {

        const payload = await jwtService.getPayloadAccessToken(authorization)

        if (payload) {

            const viewModel = commentHandler.createCommentViewModel(commentDB, payload.userId)

            return res.status(constants.HTTP_STATUS_OK).send(viewModel)
        }
    }

    const viewModel = commentHandler.createCommentViewModel(commentDB)

    return res.status(constants.HTTP_STATUS_OK).send(viewModel)
})

commentRouter.put('/:commentId',
    authAccessToken,
    checkCommentModelForUpdate,
    errorsOfValidate,
    checkOwnCommentById,
    async (req: Request, res: Response) => {

        const id = req.params.commentId
        const content = req.body.content

        await commentsRepository.updateCommentContentById(id, content)

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    })

commentRouter.put('/:commentId/like-status',
    authAccessToken,
    checkCommentById,
    likeStatusBody,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const commentId = req.params.commentId
        const likeStatus = req.body.likeStatus
        const userId = req.user!.userId

        const commentDB = await commentsRepositoryQuery.getCommentById(commentId)

        await commentService
            .addOrChangeLikesInfo(commentDB!, userId, likeStatus)

        return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    })

commentRouter.delete('/:commentId',
    authAccessToken,
    checkOwnCommentById,
    async (req: Request, res: Response) => {

        await commentsRepository.deleteCommentById(req.params.commentId)

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    })