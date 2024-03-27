import {Request, Response, Router} from "express";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";
import {UsersQueryRepository} from "../../repositories/mongodb-repository/users-mongodb/users-query-mongodb";
import {constants} from "http2";
import {UsersHandler} from "./users-handlers";
import {QueryPagingType} from "../../types/users-types";
import {authorizationMiddleware} from "../../middlewares/authorization-jwt";

// export const userRouterQuery = Router({})

// class UsersQueryController {
//
//     private usersQueryRepository: UsersQueryRepository
//     private usersHandler: UsersHandler
//
//     constructor() {
//         this.usersQueryRepository = new UsersQueryRepository()
//         this.usersHandler = new UsersHandler()
//     }
//
//     async getUsersPaging(req: Request, res: Response) {
//
//         const query = req.query as QueryPagingType
//         const filter = []
//         const login = new RegExp(query.searchLoginTerm, 'i')
//         const email = new RegExp(query.searchEmailTerm, 'i')
//
//         if (query.searchLoginTerm) filter.push({'accountData.login': login})
//         if (query.searchEmailTerm) filter.push({'accountData.email': email})
//
//         const countUsers = await this.usersQueryRepository.getCountUsers(filter)
//
//         const usersFilter = await this.usersQueryRepository.getUsersPaging(query, login, email)
//
//         //const usersForm = await usersQueryRepository.getAllUsers(req.query)
//
//         const usersPagingViewModel = await this.usersHandler
//             .createUsersPagingViewModel(countUsers, usersFilter, query)
//
//         res.status(constants.HTTP_STATUS_OK).send(usersPagingViewModel)
//     }
// }
//
// const usersQueryController = new UsersQueryController
//
// userRouterQuery.get('/',
//     authorizationMiddleware.basic.bind(authorizationMiddleware),
//     usersPaginatorDefault,
//     usersQueryController.getUsersPaging.bind(usersQueryController))

// userRouterQuery.get('/', basicAuth, usersPaginatorDefault, async (req: Request, res: Response) => {
//
//     const query = req.query as QueryPagingType
//     const filter = []
//     const login = new RegExp(query.searchLoginTerm, 'i')
//     const email = new RegExp(query.searchEmailTerm, 'i')
//
//     if (query.searchLoginTerm) filter.push({'accountData.login': login})
//     if (query.searchEmailTerm) filter.push({'accountData.email': email})
//
//     const countUsers = await usersQueryRepository.getCountUsers(filter)
//
//     const usersFilter = await usersQueryRepository.getUsersPaging(query, login, email)
//
//     //const usersForm = await usersQueryRepository.getAllUsers(req.query)
//
//     const usersPagingViewModel = await usersHandler
//         .createUsersPagingViewModel(countUsers, usersFilter, query)
//
//     res.status(constants.HTTP_STATUS_OK).send(usersPagingViewModel)
// })