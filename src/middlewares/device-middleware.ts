import {NextFunction, Request, Response} from "express";
import {JwtService} from "../applications/jwt-service";
import {DeviceSessionQueryRepository} from "../repositories/mongodb-repository/user-sessions-mongodb/user-session-query-mongodb";

class DeviceMiddleware {

    private deviceSessionQueryRepository: DeviceSessionQueryRepository
    private jwtService: JwtService

    constructor() {

        this.deviceSessionQueryRepository = new DeviceSessionQueryRepository()
        this.jwtService = new JwtService()
    }

    async deviceId(req: Request, res: Response, next: NextFunction) {

        const deviceId = req.params.deviceId

        const userSession = await this.deviceSessionQueryRepository.getDeviceByDeviceId(deviceId)

        if (!userSession) return res.sendStatus(404)

        const refreshToken = req.cookies.refreshToken

        const payLoadRefreshToken = await this.jwtService.getPayloadRefreshToken(refreshToken)

        const userId = payLoadRefreshToken!.userId

        const result = await this.deviceSessionQueryRepository
            .getDeviceSessionsByDeviceIdAndUserId(deviceId, userId)

        if (result) return next()

        return res.sendStatus(403)
    }
}

export const deviceMiddleware = new DeviceMiddleware()

// export const checkDeviceId = async (req: Request, res: Response, next: NextFunction) => {
//
//     const deviceId = req.params.deviceId
//     const userSession = await deviceSessionQueryRepository.getDeviceByDeviceId(deviceId)
//     if (!userSession) return res.sendStatus(404)
//
//     const refreshToken = req.cookies.refreshToken
//     const payLoadRefreshToken = await jwtService.getPayloadRefreshToken(refreshToken)
//     const userId = payLoadRefreshToken!.userId
//
//     const result = await deviceSessionQueryRepository
//         .getDeviceSessionsByDeviceIdAndUserId(deviceId, userId)
//
//     if (result) return next()
//     return res.sendStatus(403)
// }