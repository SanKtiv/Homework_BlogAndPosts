import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb";
import {commentsRepository} from "../repositories/mongodb-repository/comments-mongodb";

export const dellAllRouter = Router ({})

dellAllRouter.delete('/testing/all-data', async (req: Request, res: Response) => {

    await blogsRepository.deleteAll()
    await postsRepository.deleteAll()
    await usersRepository.deleteAll()
    await commentsRepository.deleteAll()

    return res.sendStatus(204)
})