import {BlogsService} from "../../services/blogs-service";
import {PostsRepository} from "../../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {UsersRepository} from "../../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {CommentsRepository} from "../../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {ApiRequestRepository} from "../../repositories/mongodb-repository/apiRequest-repository/count-request-mongodb";
import {DeviceSessionRepository} from "../../repositories/mongodb-repository/user-sessions-mongodb/user-session-mongodb";
import {Request, Response} from "express";
import {constants} from "http2";

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