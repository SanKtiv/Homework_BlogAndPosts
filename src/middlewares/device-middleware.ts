import {NextFunction, Request, Response} from "express";
import {jwtService} from "../applications/jwt-service";
import {deviceSessionRepository} from "../repositories/mongodb-repository/user-sessions-mongodb/user-session-mongodb";
import {deviceSessionQueryRepository} from "../repositories/mongodb-repository/user-sessions-mongodb/user-session-query-mongodb";

export const checkDeviceId = async (req: Request, res: Response, next: NextFunction) => {

    const deviceId = req.params.deviceId
    const userSession = await deviceSessionQueryRepository.getDeviceByDeviceId(deviceId)
    if (!userSession) return res.sendStatus(404)

    const refreshToken = req.cookies.refreshToken
    const payLoadRefreshToken = await jwtService.getPayloadRefreshToken(refreshToken)
    const userId = payLoadRefreshToken!.userId

    const result = await deviceSessionQueryRepository
        .getDeviceSessionsByDeviceIdAndUserId(deviceId, userId)

    if (result) return next()
    return res.sendStatus(403)
}