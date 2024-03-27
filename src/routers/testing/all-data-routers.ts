import {Router} from "express";
import {deleteAllController} from "../../composition-root";

// export class DeleteAllController {
//
//     constructor(protected blogsService: BlogsService,
//                 protected postsRepository: PostsRepository,
//                 protected usersRepository: UsersRepository,
//                 protected commentsRepository: CommentsRepository,
//                 protected apiRequestRepository: ApiRequestRepository,
//                 protected deviceSessionRepository: DeviceSessionRepository) {}
//
//     async deleteAll(req: Request, res: Response) {
//
//         await this.blogsService.deleteAllBlogs()
//         await this.postsRepository.deleteAll()
//         await this.usersRepository.deleteAllUsers()
//         await this.commentsRepository.deleteAll()
//         await this.apiRequestRepository.deleteAllApiRequests()
//         await this.deviceSessionRepository.deleteAllDevices()
//
//         return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//     }
// }

export const dellAllRouter = Router ({})

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