import {Router, Request, Response} from "express";
import {userService} from "../services/users-service";
import {userAuthValid} from "../validations/users-validators";
import {validErrors} from "../validations/middlewares";

export const authRouters = Router({})

authRouters.post('/auth/login', userAuthValid, validErrors, async (req: Request, res: Response) => {

    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (checkResult) return res.sendStatus(204)

    return res.sendStatus(401)

})