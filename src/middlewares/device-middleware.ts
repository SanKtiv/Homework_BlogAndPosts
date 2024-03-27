import {NextFunction, Request, Response} from "express";
import {JwtService} from "../applications/jwt-service";
import {DeviceSessionQueryRepository} from "../repositories/mongodb-repository/user-sessions-mongodb/user-session-query-mongodb";

export class DeviceMiddleware {

    constructor(protected deviceSessionQueryRepository: DeviceSessionQueryRepository,
                protected jwtService: JwtService) {}

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