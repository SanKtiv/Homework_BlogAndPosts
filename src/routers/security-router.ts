import {Request, Response, Router} from "express";
import {deviceSessionService} from "../services/device-session-service";
import {checkRefreshToken} from "../middlewares/authorization-jwt";
import {checkDeviceId} from "../middlewares/device-middleware";

export const securityRouter = Router({})

securityRouter.get('/', checkRefreshToken, async (req: Request, res: Response) => {
    const viewUserSessions = await deviceSessionService
        .getAllUserSessions(req.cookies.refreshToken)
    return res.status(200).send(viewUserSessions)
})

securityRouter.delete('/:deviceId', checkRefreshToken, checkDeviceId, async (req: Request, res: Response) => {
    const result = await deviceSessionService.deleteDeviceSessionByDeviceId(req.params.deviceId)
    res.sendStatus(204)

})

securityRouter.delete('/', checkRefreshToken, async (req: Request, res: Response) => {
    await deviceSessionService.deleteAllDevicesExcludeCurrent(req.cookies.refreshToken)
    return res.sendStatus(204)
})