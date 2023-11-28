import {Router, Request, Response} from "express";
import {authService} from "../services/auth-service";
import {userAuthValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {jwtService} from "../applications/jwt-service";
import {WithId} from "mongodb";
import {UserType} from "../types/users-types";
import {authorizationJWT} from "../middlewares/authorization-jwt";
import {userApplication} from "../applications/user-application";

export const authRouters = Router({})

authRouters.post('/login', userAuthValid, errorsOfValidate, async (req: Request, res: Response) => {

    const user: WithId<UserType> | null = await authService
        .checkCredentials(req.body.loginOrEmail, req.body.password)

    if (user) {
        const token = await jwtService.createJWT(user)
        return res.status(200).send(token)
    }
    return res.sendStatus(401)
})

authRouters.get('/me', authorizationJWT, async (req: Request, res: Response) => {

    const userInfo = await userApplication.getUserInfo(req.user!.email, req.user!.login, req.user!.userId)
    return res.status(200).send(userInfo)
})

// authRouters.post('/registration', async (req: Request, res: Response) => {
//
// })
//
// authRouters.post('/registration-confirmation', async (req: Request, res: Response) => {
//
// })
//
// authRouters.post('/registration-email-resending', async (req: Request, res: Response) => {
//
// })