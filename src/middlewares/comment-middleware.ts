import {Request, Response, NextFunction} from "express";
import {commentsRepositoryQuery} from "../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";

export const checkCommentById = async (req: Request, res:Response, next: NextFunction) => {

    const id = req.params.id || req.params.commentId
    const comment = await commentsRepositoryQuery.getCommentById(id)
    if (!comment) return res.sendStatus(404)
    return next()
}

export const checkOwnCommentById = async (req: Request, res:Response, next: NextFunction) => {

    const comment = await commentsRepositoryQuery.getCommentById(req.params.commentId)
    if (!comment) return res.sendStatus(404)
    if (comment.commentatorInfo.userId === req.user!.userId) return next()
    res.sendStatus(403)
}
