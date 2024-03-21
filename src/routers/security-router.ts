import {Request, Response, Router} from "express";
import {deviceSessionService} from "../services/device-session-service";
import {checkRefreshToken} from "../middlewares/authorization-jwt";
import {checkDeviceId} from "../middlewares/device-middleware";
import {constants} from "http2";

export const securityRouter = Router({})

securityRouter.get('/', checkRefreshToken, async (req: Request, res: Response) => {

    const viewUserSessions = await deviceSessionService
        .getAllUserSessions(req.cookies.refreshToken)

    return res.status(constants.HTTP_STATUS_OK).send(viewUserSessions)
})

securityRouter.delete('/:deviceId', checkRefreshToken, checkDeviceId, async (req: Request, res: Response) => {

    await deviceSessionService.deleteDeviceSessionByDeviceId(req.params.deviceId)

    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
})

securityRouter.delete('/', checkRefreshToken, async (req: Request, res: Response) => {

    await deviceSessionService.deleteAllDevicesExcludeCurrent(req.cookies.refreshToken)

    return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
})