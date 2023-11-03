import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb";

export const dellAllRouter = Router ({})

dellAllRouter.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsRepository.deleteAll()
    await postsRepository.deleteAll()
    return res.sendStatus(204)
})