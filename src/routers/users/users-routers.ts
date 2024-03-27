import {Request, Response, Router} from "express";
import {userInputValid} from "../../validations/users-validators";
import {errorMiddleware} from "../../middlewares/errors-middleware";
import {UsersService} from "../../services/users-service";
import {constants} from "http2";
import {UsersHandler} from "./users-handlers";
import {authorizationMiddleware} from "../../middlewares/authorization-jwt";
import {UsersQueryRepository} from "../../repositories/mongodb-repository/users-mongodb/users-query-mongodb";
import {QueryPagingType} from "../../types/users-types";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";
import {usersController} from "../../composition-root";

export const userRouter = Router({})

export class UsersController {

    constructor(protected usersService: UsersService,
                protected usersHandler: UsersHandler,
                protected usersQueryRepository: UsersQueryRepository) {}

    async createSuperUser(req: Request, res: Response) {

        const userDB = await this.usersService.createSuperUser(req.body)

        const userViewModel = await this.usersHandler.createUserViewModel(userDB)

        res.status(constants.HTTP_STATUS_CREATED).send(userViewModel)
    }

    async getUsersPaging(req: Request, res: Response) {

        const query = req.query as QueryPagingType
        const filter = []
        const login = new RegExp(query.searchLoginTerm, 'i')
        const email = new RegExp(query.searchEmailTerm, 'i')

        if (query.searchLoginTerm) filter.push({'accountData.login': login})
        if (query.searchEmailTerm) filter.push({'accountData.email': email})

        const countUsers = await this.usersQueryRepository.getCountUsers(filter)

        const usersFilter = await this.usersQueryRepository.getUsersPaging(query, login, email)

        const usersPagingViewModel = await this.usersHandler
            .createUsersPagingViewModel(countUsers, usersFilter, query)

        res.status(constants.HTTP_STATUS_OK).send(usersPagingViewModel)
    }

    async deleteUserById(req: Request, res: Response) {

        const id = req.params.id
        const result = await this.usersService.deleteUserById(id)

        if (result) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)

        return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
    }
}

//const usersController = new UsersController()

userRouter.post('/',
    authorizationMiddleware.basic.bind(authorizationMiddleware),
    ...userInputValid,
    errorMiddleware.error.bind(errorMiddleware),
    usersController.createSuperUser.bind(usersController))

userRouter.get('/',
    authorizationMiddleware.basic.bind(authorizationMiddleware),
    usersPaginatorDefault,
    usersController.getUsersPaging.bind(usersController))

userRouter.delete('/:id',
    authorizationMiddleware.basic.bind(authorizationMiddleware),
    usersController.deleteUserById.bind(usersController))
// userRouter.post('/', basicAuth,
//     ...userInputValid,
//     errorsOfValidate,
//     async (req: Request, res: Response) => {
//
//         const userDB = await usersService.createSuperUser(req.body)
//
//         const userViewModel = await this.usersHandler.createUserViewModel(userDB)
//
//         res.status(constants.HTTP_STATUS_CREATED).send(userViewModel)
//     })
//
// userRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {
//
//     const id = req.params.id
//     const result = await usersService.deleteUserById(id)
//
//     if (result) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//
//     return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
// })