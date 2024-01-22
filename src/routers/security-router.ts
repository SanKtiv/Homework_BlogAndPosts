import {Request, Response, Router} from "express";
import {userSessionService} from "../services/user-session-service";

export const securityRouter = Router({})

securityRouter.get('/', async (req: Request, res: Response) => {

    const viewUserSessions = await userSessionService
        .getAllUserSessions(req.cookies.refreshToken)

    return res.status(200).send(viewUserSessions)
})

securityRouter.delete('/:deviceId', async (req: Request, res: Response) => {

    const result = await userSessionService.deleteDeviceSessionByDeviceId(req.params.deviceId)

    if (result) return res.sendStatus(204)
    return res.sendStatus(404)
})