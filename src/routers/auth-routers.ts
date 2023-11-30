import {Router, Request, Response} from "express";
import {authService} from "../services/auth-service";
import {userAuthValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {jwtService} from "../applications/jwt-service";
import {UserDBType} from "../types/users-types";
import {authorizationJWT, checkRefreshJWT} from "../middlewares/authorization-jwt";
import {userApplication} from "../applications/user-application";

export const authRouters = Router({})

authRouters.post('/login', userAuthValid, errorsOfValidate, async (req: Request, res: Response) => {

    const checkUser: UserDBType | null = await authService
        .checkCredentials(req.body.loginOrEmail, req.body.password)

    if (checkUser) {

        const accessToken = await jwtService.createAccessJWT(checkUser)
        const refreshToken = await jwtService.createRefreshJWT(checkUser)
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        res.status(200).send(accessToken)
        return
    }
    return res.sendStatus(401)
})

authRouters.post('/refresh-token', checkRefreshJWT, async (req: Request, res: Response) => {

    const userDB = await userApplication.getUserByUserId(req.user!.userId)

    const accessToken = await jwtService.createAccessJWT(userDB!)

    const refreshToken = await jwtService.createRefreshJWT(userDB!)

    await authService.saveInvalidRefreshJWT(req.cookies.refreshToken)

    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
    res.status(200).send(accessToken)
})

authRouters.post('/logout', checkRefreshJWT, async (req: Request, res: Response) => {
    await authService.saveInvalidRefreshJWT(req.cookies.refreshToken)
    res.sendStatus(204)
})

authRouters.get('/me', authorizationJWT, async (req: Request, res: Response) => {

    const userInfo = await userApplication.getUserInfo(req.user!.email, req.user!.login, req.user!.userId)
    return res.status(200).send(userInfo)
})