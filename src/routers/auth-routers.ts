import {Router, Request, Response} from "express";
import {authService} from "../services/auth-service";
import {userAuthValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {jwtService} from "../applications/jwt-service";
import {authAccessToken, refreshJWT} from "../middlewares/authorization-jwt";
import {userApplication} from "../applications/user-application";
import {userSessionService} from "../services/user-session-service";
import {apiRequests} from "../middlewares/count-api-request-middleware";


export const authRouters = Router({})

authRouters.post('/login', apiRequests, ...userAuthValid, errorsOfValidate, async (req: Request, res: Response) => {
    const userId = await authService.checkCredentials(req.body)

    if (!userId) return res.sendStatus(401)

    const title = req.headers["user-agent"] || 'chrome 105'
    const ip = req.header('x-forwarded-for') || req.ip

    const deviceId = await userSessionService.createDeviceInUserSession(title, ip, userId)
    const accessToken = await jwtService.createAccessJWT(userId)
    const refreshToken = await jwtService.createRefreshJWT(userId, deviceId)

    await userSessionService.updateDatesDeviceSession(refreshToken)// update dates for refreshToken

    return res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send(accessToken)

})

authRouters.post('/refresh-token', refreshJWT, async (req: Request, res: Response) => {

    const userId = (await jwtService.verifyJWT(req.cookies.refreshToken))!.userId
    const accessToken = await jwtService.createAccessJWT(userId)

    const deviceId = await userSessionService
        .getDeviceIdFromRefreshToken(req.cookies.refreshToken)

    const newRefreshToken = await jwtService.createRefreshJWT(userId, deviceId)

    await userSessionService.updateDatesDeviceSession(newRefreshToken)

    //await authService.saveInvalidRefreshJWT(req.cookies.refreshToken)

    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
        .status(200)
        .send(accessToken)
})

authRouters.post('/logout', refreshJWT, async (req: Request, res: Response) => {
    const deviceId = await jwtService.getDeviceIdFromRefreshToken(req.cookies.refreshToken)
    await userSessionService.deleteDeviceSessionByDeviceId(deviceId!)
    //await authService.saveInvalidRefreshJWT(req.cookies.refreshToken)
    res.sendStatus(204)
})

authRouters.get('/me', authAccessToken, async (req: Request, res: Response) => {
    const userInfo = await userApplication.getUserInfo(req.user!.email, req.user!.login, req.user!.userId)
    return res.status(200).send(userInfo)
})