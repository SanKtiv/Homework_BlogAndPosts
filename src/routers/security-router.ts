import {Request, Response, Router} from "express";
import {userSessionService} from "../services/user-session-service";
import {refreshJWT} from "../middlewares/authorization-jwt";
import {checkDeviceId} from "../middlewares/device-middleware";

export const securityRouter = Router({})

securityRouter.get('/', refreshJWT, async (req: Request, res: Response) => {
    const viewUserSessions = await userSessionService
        .getAllUserSessions(req.cookies.refreshToken)
    return res.status(200).send(viewUserSessions)
})

securityRouter.delete('/:deviceId', refreshJWT, checkDeviceId, async (req: Request, res: Response) => {
    const result = await userSessionService.deleteDeviceSessionByDeviceId(req.params.deviceId)
    if (result) return res.sendStatus(204)
    return res.sendStatus(404)
})

securityRouter.delete('/', refreshJWT, async (req: Request, res: Response) => {
    await userSessionService.deleteAllDevicesExcludeCurrent(req.cookies.refreshToken)
    return res.sendStatus(204)
})