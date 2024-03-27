import {Request, Response, Router} from 'express';
import {PostsRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {UsersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {CommentsRepository} from "../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {ApiRequestRepository} from "../repositories/mongodb-repository/api-request-repository/count-request-mongodb";
import {DeviceSessionRepository} from "../repositories/mongodb-repository/user-sessions-mongodb/user-session-mongodb";
import {constants} from "http2";
import {BlogsService} from "../services/blogs-service";
import {deleteAllController} from "../composition-root";

export const dellAllRouter = Router ({})

export class DeleteAllController {

    constructor(protected blogsService: BlogsService,
                protected postsRepository: PostsRepository,
                protected usersRepository: UsersRepository,
                protected commentsRepository: CommentsRepository,
                protected apiRequestRepository: ApiRequestRepository,
                protected deviceSessionRepository: DeviceSessionRepository) {}

    async deleteAll(req: Request, res: Response) {

        await this.blogsService.deleteAllBlogs()
        await this.postsRepository.deleteAll()
        await this.usersRepository.deleteAllUsers()
        await this.commentsRepository.deleteAll()
        await this.apiRequestRepository.deleteAllApiRequests()
        await this.deviceSessionRepository.deleteAllDevices()

        return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }
}

dellAllRouter.delete('/', deleteAllController.deleteAll.bind(deleteAllController))

// dellAllRouter.delete('/', async function (req: Request, res: Response) {
//
//     await blogsService.deleteAllBlogs()
//     await postsRepository.deleteAll()
//     await usersRepository.deleteAllUsers()
//     await commentsRepository.deleteAll()
//     await apiRequestRepository.deleteAllApiRequests()
//     await deviceSessionRepository.deleteAllDevices()
//
//     return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
// })