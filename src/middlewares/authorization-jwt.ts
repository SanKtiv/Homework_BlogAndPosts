import {NextFunction, Response, Request} from "express";
import {jwtService} from "../applications/jwt-service";
import {userApplication} from "../applications/user-application";
import {JwtPayload} from "jsonwebtoken";
import {userSessionRepository} from "../repositories/mongodb-repository/user-session-mongodb";

export const authorizationJWT = async (req: Request, res: Response, next: NextFunction) => {
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! if, req.user
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)
        if (!userId) return res.sendStatus(401)
        req.user = await userApplication.createReqUserByUserId(userId)
        return next()
    }
    res.sendStatus(401)
}

export const checkRefreshJWT = async (req: Request, res: Response, next: NextFunction) => {

    const invalidRefreshJWT = await jwtService.getInvalidRefreshJWT(req.cookies.refreshToken)

    if (invalidRefreshJWT) return res.sendStatus(401)

    const result = await jwtService.checkRefreshToken(req.cookies.refreshToken)

    if (!result) return res.sendStatus(401)

    req.user = await userApplication.createReqUserByUserId(result)
    return next()
}

export const refreshJWT = async (req: Request, res: Response, next: NextFunction) => {


    if (!req.cookies.refreshToken) return res.sendStatus(401)

    const refreshToken = await jwtService.verifyJWT(req.cookies.refreshToken)

    if (!refreshToken) return res.sendStatus(401)

    if (refreshToken.exp! < Math.floor(Date.now() / 1000)) return res.sendStatus(401)

    const result = await userSessionRepository
        .getUserSessionsByDeviceIdAndUserId(refreshToken.deviceId, refreshToken.userId)

    if (!result) return res.sendStatus(401)

    return next()
}