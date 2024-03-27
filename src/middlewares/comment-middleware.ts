import {Request, Response, NextFunction} from "express";
import {CommentsQueryRepository} from "../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";

export class CommentsMiddleware {

    constructor(protected commentsQueryRepository: CommentsQueryRepository) {}

    async commentId(req: Request, res:Response, next: NextFunction) {

        const id = req.params.id || req.params.commentId

        const comment = await this.commentsQueryRepository.getCommentById(id)

        if (!comment) return res.sendStatus(404)

        return next()
    }

    async commentOwner(req: Request, res:Response, next: NextFunction) {

        const comment = await this.commentsQueryRepository.getCommentById(req.params.commentId)

        if (!comment) return res.sendStatus(404)

        if (comment.commentatorInfo.userId === req.user!.userId) return next()

        res.sendStatus(403)
    }
}
