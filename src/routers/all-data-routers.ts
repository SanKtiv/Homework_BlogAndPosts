import {Request, Response, Router} from 'express';
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {commentsRepository} from "../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {apiRequestRepository} from "../repositories/mongodb-repository/api-request-repository/count-request-mongodb";
import {deviceSessionRepository} from "../repositories/mongodb-repository/user-sessions-mongodb/user-session-mongodb";
import {constants} from "http2";
import {BlogsService, blogsService} from "../services/blogs-service";

export const dellAllRouter = Router ({})

class DeleteAllController {

    private blogsService: BlogsService

    constructor() {

        this.blogsService = new BlogsService()
    }

    async deleteAll(req: Request, res: Response) {

        await this.blogsService.deleteAllBlogs()
        await postsRepository.deleteAll()
        await usersRepository.deleteAllUsers()
        await commentsRepository.deleteAll()
        await apiRequestRepository.deleteAllApiRequests()
        await deviceSessionRepository.deleteAllDevices()

        return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }
}

dellAllRouter.delete('/', async function (req: Request, res: Response) {

    await blogsService.deleteAllBlogs()
    await postsRepository.deleteAll()
    await usersRepository.deleteAllUsers()
    await commentsRepository.deleteAll()
    await apiRequestRepository.deleteAllApiRequests()
    await deviceSessionRepository.deleteAllDevices()

    return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
})