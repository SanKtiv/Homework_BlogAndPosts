import {UsersService} from "../../services/users-service";
import {UsersHandler} from "./users-handlers";
import {UsersQueryRepository} from "../../repositories/mongodb-repository/users-mongodb/users-query-mongodb";
import {Request, Response} from "express";
import {constants} from "http2";
import {QueryPagingType} from "../../types/users-types";

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