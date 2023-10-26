import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/blogs_MongoDB";
import {postsRepository} from "../repositories/posts_MongoDB";

export const dellAllRouter = Router ({})

dellAllRouter.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsRepository.deleteAll()
    await postsRepository.deleteAll()
    return res.sendStatus(204)
})