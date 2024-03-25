import {Request, Response, Router} from "express";
import {userInputValid} from "../../validations/users-validators";
import {basicAuth} from "../../middlewares/authorization-basic";
import {errorMiddleware} from "../../middlewares/error-validators-middleware";
import {UsersService} from "../../services/users-service";
import {constants} from "http2";
import {UsersHandler} from "./users-handlers";

export const userRouter = Router({})

class UsersController {

    private usersService: UsersService
    private usersHandler: UsersHandler

    constructor() {
        this.usersService = new UsersService()
        this.usersHandler = new UsersHandler()
    }

    async createSuperUser(req: Request, res: Response) {

        const userDB = await this.usersService.createSuperUser(req.body)

        const userViewModel = await this.usersHandler.createUserViewModel(userDB)

        res.status(constants.HTTP_STATUS_CREATED).send(userViewModel)
    }

    async deleteUserById(req: Request, res: Response) {

        const id = req.params.id
        const result = await this.usersService.deleteUserById(id)

        if (result) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)

        return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
    }
}

const usersController = new UsersController()

userRouter.post('/', basicAuth,
    ...userInputValid,
    errorMiddleware.error.bind(errorMiddleware),
    usersController.createSuperUser.bind(usersController))

userRouter.delete('/:id',
    basicAuth,
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