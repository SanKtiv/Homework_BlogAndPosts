import {Request, Response, NextFunction} from "express";
import {commentsRepository} from "../repositories/mongodb-repository/comments-mongodb";

export const checkCommentById = async (req: Request, res:Response, next: NextFunction) => {

    const comment = await commentsRepository.findCommentById(req.params.id)
    if (!comment) return res.sendStatus(404)
    return next()
}