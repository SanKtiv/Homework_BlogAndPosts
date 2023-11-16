import {Router, Response, Request} from "express";
import {checkId} from "../validations/comments-validators";
import {checkCommentById} from "../validations/comment-middleware";
import {commentsRepository} from "../repositories/mongodb-repository/comments-mongodb";
import {commentService} from "../services/commets-service";

export const commentRouter = Router({})

commentRouter.get('/:id', checkId, checkCommentById, async (req: Request, res: Response) => {

    const commentDB = await commentsRepository.findCommentById(req.params.id)
    const comment = commentService.createCommentViewModel(commentDB!)

    res.status(200).send(comment)
})