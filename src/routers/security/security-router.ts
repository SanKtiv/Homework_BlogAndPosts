import {Router} from "express";
import {authorizationMiddleware} from "../../middlewares/authorization-jwt";
import {deviceMiddleware} from "../../middlewares/device-middleware";
import {securityDevicesController} from "../../composition-root";

export const securityRouter = Router({})

// export class SecurityDevicesController {
//
//     constructor(protected jwtService: JwtService,
//                 protected deviceSessionQueryRepository: DeviceSessionQueryRepository,
//                 protected securityHandler: SecurityHandler,
//                 protected deviceSessionService: DeviceSessionService) {}
//
//     async getDeviceSessions(req: Request, res: Response) {
//
//         const refreshToken = req.cookies.refreshToken
//
//         const payload = await this.jwtService.getPayloadRefreshToken(refreshToken)
//
//         const deviceSessions = await this.deviceSessionQueryRepository
//             .getDeviceSessionsByUserId(payload!.userId)
//
//         const deviceSessionsViewModel = await this.securityHandler
//             .getDeviceSessionsViewModel(deviceSessions)
//
//         return res.status(constants.HTTP_STATUS_OK).send(deviceSessionsViewModel)
//     }
//
//     async deleteDeviceSessionById(req: Request, res: Response) {
//
//         await this.deviceSessionService
//             .deleteDeviceSessionByDeviceId(req.params.deviceId)
//
//         res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//     }
//
//     async deleteAllDevicesExcludeCurrent(req: Request, res: Response) {
//
//         await this.deviceSessionService
//             .deleteAllDevicesExcludeCurrent(req.cookies.refreshToken)
//
//         return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//     }
// }

securityRouter.get('/',
    authorizationMiddleware.refreshToken.bind(authorizationMiddleware),
    securityDevicesController.getDeviceSessions.bind(securityDevicesController))

securityRouter.delete('/:deviceId',
    authorizationMiddleware.refreshToken.bind(authorizationMiddleware),
    deviceMiddleware.deviceId.bind(deviceMiddleware),
    securityDevicesController.deleteDeviceSessionById.bind(securityDevicesController))

securityRouter.delete('/',
    authorizationMiddleware.refreshToken.bind(authorizationMiddleware),
    securityDevicesController.deleteAllDevicesExcludeCurrent.bind(securityDevicesController))



// securityRouter.get('/',
//     checkRefreshToken,
//     async (req: Request, res: Response) => {
//
//     const refreshToken = req.cookies.refreshToken
//
//     const payload = await jwtService.getPayloadRefreshToken(refreshToken)
//
//     const deviceSessions = await deviceSessionQueryRepository
//         .getDeviceSessionsByUserId(payload!.userId)
//
//     const deviceSessionsViewModel = await securityHandler
//         .getDeviceSessionsViewModel(deviceSessions)
//
//     return res.status(constants.HTTP_STATUS_OK).send(deviceSessionsViewModel)
// })
//
// securityRouter.delete('/:deviceId',
//     checkRefreshToken,
//     checkDeviceId,
//     async (req: Request, res: Response) => {
//
//     await deviceSessionService.deleteDeviceSessionByDeviceId(req.params.deviceId)
//
//     res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
// })
//
// securityRouter.delete('/',
//     checkRefreshToken,
//     async (req: Request, res: Response) => {
//
//     await deviceSessionService.deleteAllDevicesExcludeCurrent(req.cookies.refreshToken)
//
//     return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
// })