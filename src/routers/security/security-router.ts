import {Request, Response, Router} from "express";
import {deviceSessionService} from "../../services/device-session-service";
import {checkRefreshToken} from "../../middlewares/authorization-jwt";
import {checkDeviceId} from "../../middlewares/device-middleware";
import {constants} from "http2";
import {jwtService} from "../../applications/jwt-service";
import {deviceSessionQueryRepository} from "../../repositories/mongodb-repository/user-sessions-mongodb/user-session-query-mongodb";
import {securityHandler} from "./security-handler";

export const securityRouter = Router({})

securityRouter.get('/', checkRefreshToken, async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken

    const payload = await jwtService.getPayloadRefreshToken(refreshToken)

    const deviceSessions = await deviceSessionQueryRepository
        .getDeviceSessionsByUserId(payload!.userId)

    const deviceSessionsViewModel = await securityHandler
        .getDeviceSessionsViewModel(deviceSessions)

    return res.status(constants.HTTP_STATUS_OK).send(deviceSessionsViewModel)
})

securityRouter.delete('/:deviceId', checkRefreshToken, checkDeviceId, async (req: Request, res: Response) => {

    await deviceSessionService.deleteDeviceSessionByDeviceId(req.params.deviceId)

    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
})

securityRouter.delete('/', checkRefreshToken, async (req: Request, res: Response) => {

    await deviceSessionService.deleteAllDevicesExcludeCurrent(req.cookies.refreshToken)

    return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
})