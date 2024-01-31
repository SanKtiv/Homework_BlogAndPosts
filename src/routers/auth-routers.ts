import {Router, Request, Response} from "express";
import {authService} from "../services/auth-service";
import {userAuthValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {jwtService} from "../applications/jwt-service";
import {authAccessToken, checkRefreshToken} from "../middlewares/authorization-jwt";
import {userApplication} from "../applications/user-application";
import {deviceSessionService} from "../services/device-session-service";
import {apiRequests} from "../middlewares/count-api-request-middleware";

export const authRouters = Router({})

authRouters.post('/login', apiRequests, ...userAuthValid, errorsOfValidate, async (req: Request, res: Response) => {

    const userId = await authService.checkCredentials(req.body)

    if (!userId) return res.sendStatus(401)

    const title = req.headers["user-agent"] || 'chrome 105'
    const ip = req.header('x-forwarded-for') || req.ip

    const deviceId = await deviceSessionService.createDeviceSession(title, ip, userId)
    const accessToken = await jwtService.createAccessToken(userId)
    const refreshToken = await jwtService.createRefreshToken(userId, deviceId)

    return res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send(accessToken)
})

authRouters.post('/refresh-token', checkRefreshToken, async (req: Request, res: Response) => {

    const payload = await jwtService.getPayloadRefreshToken(req.cookies.refreshToken)
    const accessToken = await jwtService.createAccessToken(payload!.userId)
    const newRefreshToken = await jwtService.createRefreshToken(payload!.userId, payload!.deviceId)

    return res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
        .status(200)
        .send(accessToken)
})

authRouters.post('/logout', checkRefreshToken, async (req: Request, res: Response) => {
    const payload = await jwtService.getPayloadRefreshToken(req.cookies.refreshToken)
    await deviceSessionService.deleteDeviceSessionByDeviceId(payload!.deviceId)
    return res.sendStatus(204)
})

authRouters.get('/me', authAccessToken, async (req: Request, res: Response) => {
    // const userInfo = await userApplication.createUserInfo(req.user!.email, req.user!.login, req.user!.userId)
    return res.status(200).send(req.user!)
})