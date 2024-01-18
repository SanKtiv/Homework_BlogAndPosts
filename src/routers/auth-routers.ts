import {Router, Request, Response} from "express";
import {authService} from "../services/auth-service";
import {userAuthValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {jwtService} from "../applications/jwt-service";
import {authorizationJWT, checkRefreshJWT} from "../middlewares/authorization-jwt";
import {userApplication} from "../applications/user-application";
import {userSessionService} from "../services/user-session-service";


export const authRouters = Router({})

authRouters.post('/login', userAuthValid, errorsOfValidate, async (req: Request, res: Response) => {

    const userId: string | null = await authService
        .checkCredentials(req.body.loginOrEmail, req.body.password)

    if (userId) {

        const title = req.headers["user-agent"] || 'chrome 105'
        const ip = req.header('x-forwarded-for') || req.ip

        const deviceId = await userSessionService.createUserSession(title, ip, userId)

        const accessToken = await jwtService.createAccessJWT(userId)
        const refreshToken = await jwtService.createRefreshJWT(userId, deviceId)

        const userSession = await userSessionService.updateUserSession(refreshToken)

        console.log(userSession)
        console.log(req.cookies)
        // console.log(Number(new Date(result.iat!)))
        // console.log(result.iat!.toString())
        // console.log(typeof req.ip.toString())
        // console.log(req.header('x-forwarded-for'))
        // console.log(typeof req.socket.remoteAddress)
        // console.log(userId)
        // console.log(result.userId)

        return res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send(accessToken)
    }
    return res.sendStatus(401)
})

authRouters.post('/refresh-token', checkRefreshJWT, async (req: Request, res: Response) => {

    const userId = await userApplication.getUserByUserId(req.user!.userId)
    const accessToken = await jwtService.createAccessJWT(userId!)
    const refreshToken = await jwtService.createRefreshJWT(userId!, '1234567890')

    await authService.saveInvalidRefreshJWT(req.cookies.refreshToken)

    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        .status(200)
        .send(accessToken)
})

authRouters.post('/logout', checkRefreshJWT, async (req: Request, res: Response) => {
    await authService.saveInvalidRefreshJWT(req.cookies.refreshToken)
    res.sendStatus(204)
})

authRouters.get('/me', authorizationJWT, async (req: Request, res: Response) => {

    const userInfo = await userApplication.getUserInfo(req.user!.email, req.user!.login, req.user!.userId)
    return res.status(200).send(userInfo)
})