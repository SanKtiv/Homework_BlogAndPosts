import {Request, Response, Router} from 'express';
import {postsRepositoryQuery} from "../repositories/mongodb-repository/posts-mongodb-Query";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb";
import {queryBlogIdMiddleware} from "../validations/middlewares";

export const postRouterQuery = Router ({})

postRouterQuery.get( '/posts', queryBlogIdMiddleware, async (req: Request, res: Response) => {

    return res.status(200).send(await postsRepositoryQuery.getPostsWithPaging(req.query))
})

postRouterQuery.get( '/posts/:id', async (req: Request, res: Response) => {
    const posts = await postsRepository.getPostById(req.params.id)
    if (posts) return res.status(200).send(posts)
    return res.sendStatus(404)
})