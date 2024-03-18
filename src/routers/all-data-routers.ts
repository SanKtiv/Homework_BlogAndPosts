import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {commentsRepository} from "../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {apiRequestRepository} from "../repositories/mongodb-repository/api-request-repository/count-request-mongodb";
import {deviceSessionRepository} from "../repositories/mongodb-repository/user-sessions-repository/user-session-mongodb";

export const dellAllRouter = Router ({})

dellAllRouter.delete('/', async (req: Request, res: Response) => {

    await blogsRepository.deleteAll()
    await postsRepository.deleteAll()
    await usersRepository.deleteAllUsers()
    await commentsRepository.deleteAll()
    //await usersRepository.deleteAllTokens()
    await apiRequestRepository.deleteAllApiRequests()
    await deviceSessionRepository.deleteAllDevices()
    //await blogsRepository.deleteAllBlogs()

    return res.sendStatus(204)
})