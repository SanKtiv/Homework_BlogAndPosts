import {NextFunction, Response, Request} from "express";
import {jwtService} from "../applications/jwt-service";
import {userApplication} from "../applications/user-application";
import {deviceSessionService} from "../services/device-session-service";

export const authAccessToken = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) return res.sendStatus(401)

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)

    if (!userId) return res.sendStatus(401)

    req.user = await userApplication.createReqUserByUserId(userId)

    return next()
}

// export const checkRefreshJWT = async (req: Request, res: Response, next: NextFunction) => {
//
//     const invalidRefreshJWT = await jwtService.getInvalidRefreshJWT(req.cookies.refreshToken)
//
//     if (invalidRefreshJWT) return res.sendStatus(401)
//
//     const result = await jwtService.verifyJWT(req.cookies.refreshToken)
//
//     if (!result) return res.sendStatus(401)
//
//     req.user = await userApplication.createReqUserByUserId(result.userId)
//     return next()
// }

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.cookies.refreshToken) return res.sendStatus(401)

    const tokenPayload = await jwtService.verifyJWT(req.cookies.refreshToken)

    if (!tokenPayload) return res.sendStatus(401)

    const session = await deviceSessionService.getDeviceSessionByDeviceId(tokenPayload.deviceId)

    if (!session || session.userId !== tokenPayload.userId) return res.sendStatus(401)
    if (session.lastActiveDate !== new Date(tokenPayload.iat! * 1000).toISOString()) return res.sendStatus(401)

    return next()
}