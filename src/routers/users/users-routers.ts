import {Request, Response, Router} from "express";
import {userInputValid} from "../../validations/users-validators";
import {basicAuth} from "../../middlewares/authorization-basic";
import {errorsOfValidate} from "../../middlewares/error-validators-middleware";
import {userService} from "../../services/users-service";
import {constants} from "http2";

export const userRouter = Router({})

userRouter.post('/', basicAuth,
    ...userInputValid,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const user = await userService.createSuperUser(req.body)

        res.status(constants.HTTP_STATUS_CREATED).send(user)
    })

userRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {

    const id = req.params.id
    const result = await userService.deleteUserById(id)

    if (result) return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)

    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
})