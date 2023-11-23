import {Request, Response, Router} from "express";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb";
import {userInputValid} from "../validations/users-validators";
import {authService} from "../services/auth-service";
import {basicAuth} from "../middlewares/authorization-basic";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";

export const userRouter = Router({})

userRouter.post('/',basicAuth , userInputValid, errorsOfValidate, async (req: Request, res: Response) => {

    const user = await authService.createUser(req.body)
    res.status(201).send(user)
})

userRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {

    if (await usersRepository.deleteById(req.params.id)) return res.sendStatus(204)
    return res.sendStatus(404)
})