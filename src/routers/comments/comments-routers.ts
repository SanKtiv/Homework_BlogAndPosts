import {Router, Response, Request} from "express";
import {checkCommentModelForUpdate, checkId} from "../../validations/comments-validators";
import {checkCommentById, checkOwnCommentById} from "../../middlewares/comment-middleware";
import {commentsRepository} from "../../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {commentService} from "../../services/commets-service";
import {authAccessToken} from "../../middlewares/authorization-jwt";
import {errorsOfValidate} from "../../middlewares/error-validators-middleware";
import {jwtService} from "../../applications/jwt-service";
import {likeStatusBody} from "../../validations/like-status-validation";

export const commentRouter = Router({})

commentRouter.get('/:id',
    checkId,
    checkCommentById,
    async (req: Request, res: Response) => {

        const accessToken = jwtService
            .getAccessTokenFromHeaders(req.headers.authorization as string)

        const userId = (await jwtService
            .getPayloadAccessToken(accessToken))!.userId

        const commentDB = await commentsRepository
            .findCommentWithUserLikeStatus(req.params.id, userId)

        const comment = commentService.createCommentViewModel(commentDB!)

        res.status(200).send(comment)
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