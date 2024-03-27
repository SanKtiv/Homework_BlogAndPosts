import {NextFunction, Request, Response} from "express";
import {PostsQueryRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";

export class PostsMiddleware {

    constructor(protected postsQueryRepository: PostsQueryRepository) {}

    async postId(req: Request, res: Response, next: NextFunction) {

        const post = await this.postsQueryRepository.getPostById(req.params.postId)

        if (!post) return res.sendStatus(404)

        return next()
    }
}