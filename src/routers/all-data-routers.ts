import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {commentsRepository} from "../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {apiRequestRepository} from "../repositories/mongodb-repository/api-request-repository/count-request-mongodb";
import {deviceSessionRepository} from "../repositories/mongodb-repository/user-sessions-repository/user-session-mongodb";
import {constants} from "http2";

export const dellAllRouter = Router ({})

dellAllRouter.delete('/', async (req: Request, res: Response) => {

    await blogsRepository.deleteAll()
    await postsRepository.deleteAll()
    await usersRepository.deleteAllUsers()
    await commentsRepository.deleteAll()
    await apiRequestRepository.deleteAllApiRequests()
    await deviceSessionRepository.deleteAllDevices()

    return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
})