import {Router, Response, Request} from "express";
import {checkCommentModelForUpdate, checkId} from "../../validations/comments-validators";
import {checkCommentById, checkOwnCommentById} from "../../middlewares/comment-middleware";
import {commentsRepository} from "../../repositories/mongodb-repository/comments-mongodb/comments-mongodb";
import {commentService} from "../../services/commets-service";
import {authorizationJWT} from "../../middlewares/authorization-jwt";
import {errorsOfValidate} from "../../middlewares/error-validators-middleware";

export const commentRouter = Router({})

commentRouter.get('/:id',
    checkId,
    checkCommentById,
    async (req: Request, res: Response) => {

    const commentDB = await commentsRepository.findCommentById(req.params.id)
    const comment = commentService.createCommentViewModel(commentDB!)

    res.status(200).send(comment)
})

commentRouter.put('/:commentId',
    authorizationJWT,
    checkCommentModelForUpdate,
    errorsOfValidate,
    checkOwnCommentById,
    async (req: Request, res: Response) => {

    await commentsRepository.updateCommentById(req.params.commentId, req.body.content)
    res.sendStatus(204)
})

commentRouter.delete('/:commentId',
    authorizationJWT,
    checkOwnCommentById,
    async (req: Request, res: Response) => {

    await commentsRepository.deleteCommentById(req.params.commentId)
    res.sendStatus(204)
})