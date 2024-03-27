import {JwtService} from "../../applications/jwt-service";
import {DeviceSessionQueryRepository} from "../../repositories/mongodb-repository/user-sessions-mongodb/user-session-query-mongodb";
import {SecurityHandler} from "./security-handler";
import {DeviceSessionService} from "../../services/device-session-service";
import {Request, Response} from "express";
import {constants} from "http2";

export class SecurityDevicesController {

    constructor(protected jwtService: JwtService,
                protected deviceSessionQueryRepository: DeviceSessionQueryRepository,
                protected securityHandler: SecurityHandler,
                protected deviceSessionService: DeviceSessionService) {}

    async getDeviceSessions(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken

        const payload = await this.jwtService.getPayloadRefreshToken(refreshToken)

        const deviceSessions = await this.deviceSessionQueryRepository
            .getDeviceSessionsByUserId(payload!.userId)

        const deviceSessionsViewModel = await this.securityHandler
            .getDeviceSessionsViewModel(deviceSessions)

        return res.status(constants.HTTP_STATUS_OK).send(deviceSessionsViewModel)
    }

    async deleteDeviceSessionById(req: Request, res: Response) {

        await this.deviceSessionService
            .deleteDeviceSessionByDeviceId(req.params.deviceId)

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async deleteAllDevicesExcludeCurrent(req: Request, res: Response) {

        await this.deviceSessionService
            .deleteAllDevicesExcludeCurrent(req.cookies.refreshToken)

        return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }
}