import {NextFunction, Request, Response} from "express";
import {jwtService} from "../applications/jwt-service";

export const checkDeviceId = async (req: Request, res: Response, next: NextFunction) => {

    const deviceId = req.params.deviceId
    const refreshToken = req.cookies.refreshToken
    const payLoadRefreshToken = await jwtService.verifyJWT(refreshToken)

    if (deviceId === payLoadRefreshToken!.deviceId) return next()
    return res.sendStatus(403)
}