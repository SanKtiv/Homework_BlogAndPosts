import {NextFunction, Request, Response} from "express";
import {jwtService} from "../applications/jwt-service";
import {userSessionRepository} from "../repositories/mongodb-repository/user-session-mongodb";

export const checkDeviceId = async (req: Request, res: Response, next: NextFunction) => {

    const deviceId = req.params.deviceId
    const refreshToken = req.cookies.refreshToken
    const payLoadRefreshToken = await jwtService.verifyJWT(refreshToken)
    const userId = payLoadRefreshToken!.userId
    const result = await userSessionRepository
        .getUserSessionsByDeviceIdAndUserId(deviceId, userId)

    if (result) return next()
    return res.sendStatus(403)
}