import {Request, Response, Router} from 'express';
import {postsRepositoryQuery} from "../repositories/mongodb-repository/posts-mongodb-Query";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb";

export const postRouterQuery = Router ({})

postRouterQuery.get( '/posts', async (req: Request, res: Response) => {
    if (Object.keys(req.query).length) {
        return res.status(200).send(await postsRepositoryQuery.getPostsWithPaging(req.query))
    }
    return res.status(200).send(await postsRepository.getAllPosts())
})

postRouterQuery.get( '/posts/:id', async (req: Request, res: Response) => {
        const posts = await postsRepository.getPostById(req.params.id)
        if (posts) return res.status(200).send(posts)
        return res.sendStatus(404)
})