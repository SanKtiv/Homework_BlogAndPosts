import {NextFunction, Request, Response} from "express";
import {postsQueryRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";

export const checkPostByPostId = async (req: Request, res: Response, next: NextFunction) => {

    const post = await postsQueryRepository.getPostById(req.params.postId)

    if (!post) return res.sendStatus(404)

    return next()
}