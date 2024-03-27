import {Router} from "express";
import {authMiddleware} from "../../middlewares/auth-middleware";
import {deviceMiddleware, securityDevicesController} from "../../composition-root";

export const securityRouter = Router({})

securityRouter.get('/',
    authMiddleware.refreshToken.bind(authMiddleware),
    securityDevicesController.getDeviceSessions.bind(securityDevicesController))

securityRouter.delete('/:deviceId',
    authMiddleware.refreshToken.bind(authMiddleware),
    deviceMiddleware.deviceId.bind(deviceMiddleware),
    securityDevicesController.deleteDeviceSessionById.bind(securityDevicesController))

securityRouter.delete('/',
    authMiddleware.refreshToken.bind(authMiddleware),
    securityDevicesController.deleteAllDevicesExcludeCurrent.bind(securityDevicesController))