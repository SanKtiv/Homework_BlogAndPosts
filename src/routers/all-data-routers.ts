import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/blogs_db";
import {postsRepository} from "../repositories/posts_db";

export const dellAllRouter = Router ({})

dellAllRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    blogsRepository.deleteAll()
    postsRepository.deleteAll()
    res.sendStatus(204)
})