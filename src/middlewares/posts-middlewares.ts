import {NextFunction, Request, Response} from "express";
import {PostsQueryRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";

class PostsMiddleware {

    private postsQueryRepository: PostsQueryRepository

    constructor() {

        this.postsQueryRepository = new PostsQueryRepository()
    }

    async postId(req: Request, res: Response, next: NextFunction) {

        const post = await this.postsQueryRepository.getPostById(req.params.postId)

        if (!post) return res.sendStatus(404)

        return next()
    }
}

export const postsMiddleware = new PostsMiddleware()

// export const checkPostByPostId = async (req: Request, res: Response, next: NextFunction) => {
//
//     const post = await postsQueryRepository.getPostById(req.params.postId)
//
//     if (!post) return res.sendStatus(404)
//
//     return next()
// }