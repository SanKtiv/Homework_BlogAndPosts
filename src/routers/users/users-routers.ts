import {Request, Response, Router} from "express";
import {userInputValid} from "../../validations/users-validators";
import {basicAuth} from "../../middlewares/authorization-basic";
import {errorsOfValidate} from "../../middlewares/error-validators-middleware";
import {userService} from "../../services/users-service";

export const userRouter = Router({})

userRouter.post('/',basicAuth ,
    ...userInputValid,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const user = await userService.createSuperUser(req.body)

        res.status(201).send(user)
})

userRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {

    if (await userService.deleteUserById(req.params.id)) return res.sendStatus(204)

    return res.sendStatus(404)
})