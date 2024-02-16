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
import {commentHandlers} from "./comments-handlers";

export const commentRouter = Router({})

commentRouter.get('/:id', checkId, async (req: Request, res: Response) => {

    const id = req.params.id
    const authorization = req.headers.authorization

    let commentDB = await commentsRepositoryQuery.getCommentById(id)

    if (!commentDB) return res.sendStatus(404)

    if (!authorization) {

        const comment = commentHandlers.createCommentViewModel(commentDB)

        return res.status(200).send(comment)
    }

    const payload = await jwtService.getPayloadAccessToken(authorization)

    if (!payload) {

        const comment = commentHandlers.createCommentViewModel(commentDB)

        return res.status(200).send(comment)
    }

    commentDB = await commentsRepositoryQuery
        .findCommentWithUserLikeStatus(id, payload.userId)

    const comment = commentHandlers.createCommentViewModel(commentDB!, payload.userId)

    return res.status(200).send(comment)
})

commentRouter.put('/:commentId',
    authAccessToken,
    checkCommentModelForUpdate,
    errorsOfValidate,
    checkOwnCommentById,
    async (req: Request, res: Response) => {

    await commentsRepository.updateCommentContentById(req.params.commentId, req.body.content)
    res.sendStatus(204)
})

commentRouter.put('/:commentId/like-status',
    authAccessToken,
    checkCommentById,
    likeStatusBody,
    errorsOfValidate,
    async (req: Request, res: Response) => {

    await commentService
        .createLikesInfo(req.params.commentId, req.body.likeStatus, req.headers!.authorization!)

        res.sendStatus(204)
})

commentRouter.delete('/:commentId',
    authAccessToken,
    checkOwnCommentById,
    async (req: Request, res: Response) => {

    await commentsRepository.deleteCommentById(req.params.commentId)
    res.sendStatus(204)
})