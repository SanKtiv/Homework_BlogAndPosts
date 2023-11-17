import {NextFunction, Request, Response} from "express";
import {postsRepositoryQuery} from "../repositories/mongodb-repository/posts-mongodb-Query";

export const checkPostByPostId = async (req: Request, res: Response, next: NextFunction) => {

    const post = await postsRepositoryQuery.findPostByPostId(req.params.postId)
    if (!post) return res.sendStatus(404)// Если нет return приложение падает, выдает ошибку Cannot set headers after they are sent to the client
    return next()//Если перед res есть return, а здесь нет, то ts выдает ошибку: Not all code paths return a value
}