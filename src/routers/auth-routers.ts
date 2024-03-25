import {Router, Request, Response} from "express";
import {AuthService} from "../services/auth-service";
import {emailPasswordRecovery, userAuthValid} from "../validations/users-validators";
import {errorMiddleware} from "../middlewares/error-validators-middleware";
import {JwtService} from "../applications/jwt-service";
import {authorizationMiddleware} from "../middlewares/authorization-jwt";
import {DeviceSessionService} from "../services/device-session-service";
import {apiRequests, countRequestsToApi} from "../middlewares/count-api-request-middleware";
import {EmailAdapter} from "../adapters/mail-adapter";
import {authValidation} from "../validations/recovery-password-validators";
import {constants} from "http2";

export const authRouters = Router({})

class AuthController {

    private authService: AuthService
    private jwtService: JwtService
    private deviceSessionService: DeviceSessionService
    private emailAdapter: EmailAdapter

    constructor() {

        this.authService = new AuthService()
        this.jwtService = new JwtService()
        this.deviceSessionService = new DeviceSessionService()
        this.emailAdapter = new EmailAdapter()
    }

    async createAndSendAccessToken(req: Request, res: Response) {

        const userId = await this.authService.checkCredentials(req.body)

        if (!userId) return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)

        const title = req.headers["user-agent"] || 'chrome 105'

        const ip = req.header('x-forwarded-for') || req.ip

        const deviceId = await this.deviceSessionService.createDeviceSession(title, ip, userId)

        const accessToken = await this.jwtService.createAccessToken(userId)

        const refreshToken = await this.jwtService.createRefreshToken(userId, deviceId)

        await this.deviceSessionService.updateDatesDeviceSession(refreshToken)

        return res
            .cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            .status(constants.HTTP_STATUS_OK)
            .send(accessToken)
    }

    async sendRecoveryCode(req: Request, res: Response) {

        await this.authService.recoveryPassword(req.body.email)

        await this.emailAdapter.sendRecoveryCode(req.body.email)

        return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async createNewPassword(req: Request, res: Response) {

        await this.authService.createNewPassword(req.body)

        return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async updateRefreshToken(req: Request, res: Response) {

        const payload = await this.jwtService
            .getPayloadRefreshToken(req.cookies.refreshToken)

        const accessToken = await this.jwtService
            .createAccessToken(payload!.userId)

        const newRefreshToken = await this.jwtService
            .createRefreshToken(payload!.userId, payload!.deviceId)

        await this.deviceSessionService.updateDatesDeviceSession(newRefreshToken)

        return res
            .cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
            .status(constants.HTTP_STATUS_OK)
            .send(accessToken)
    }

    async deleteDeviceSession(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken

        const payload = await this.jwtService.getPayloadRefreshToken(refreshToken)

        await this.deviceSessionService.deleteDeviceSessionByDeviceId(payload!.deviceId)

        return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async getInfoCurrentUser(req: Request, res: Response) {

        return res.status(constants.HTTP_STATUS_OK).send(req.user!)
    }
}

const authController = new AuthController()

authRouters.post('/login',
    countRequestsToApi.countRequests.bind(countRequestsToApi),
    ...userAuthValid,
    errorMiddleware.error.bind(errorMiddleware),
    authController.createAndSendAccessToken.bind(authController))

authRouters.post('/password-recovery',
    apiRequests,
    emailPasswordRecovery,
    authController.sendRecoveryCode.bind(authController))

authRouters.post('/new-password',
    apiRequests,
    authValidation.password.bind(authValidation),
    authValidation.recoveryCode.bind(authValidation),
    errorMiddleware.error.bind(errorMiddleware),
    authController.createNewPassword.bind(authController))

authRouters.post('/refresh-token',
    authorizationMiddleware.refreshToken.bind(authorizationMiddleware),
    authController.updateRefreshToken.bind(authController))

authRouters.post('/logout',
    authorizationMiddleware.refreshToken.bind(authorizationMiddleware),
    authController.deleteDeviceSession.bind(authController))

authRouters.get('/me',
    authorizationMiddleware.accessToken.bind(authorizationMiddleware),
    authController.getInfoCurrentUser.bind(authController))

// authRouters.post('/login',
//     countRequestsToApi.countRequests.bind(countRequestsToApi),
//     ...userAuthValid,
//     errorsOfValidate,
//     async (req: Request, res: Response) => {
//
//     const userId = await authService.checkCredentials(req.body)
//
//     if (!userId) return res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
//
//     const title = req.headers["user-agent"] || 'chrome 105'
//     const ip = req.header('x-forwarded-for') || req.ip
//
//     const deviceId = await deviceSessionService.createDeviceSession(title, ip, userId)
//     const accessToken = await jwtService.createAccessToken(userId)
//     const refreshToken = await jwtService.createRefreshToken(userId, deviceId)
//
//     return res
//         .cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
//         .status(constants.HTTP_STATUS_OK)
//         .send(accessToken)
// })

// authRouters.post('/password-recovery',
//     apiRequests,
//     emailPasswordRecovery,
//     errorsOfValidate, async (req: Request, res: Response) => {
//
//         await authService.recoveryPassword(req.body.email)
//
//         await emailAdapter.sendRecoveryCode(req.body.email)
//
//         return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
//     })

// authRouters.post('/new-password',
//     apiRequests,
//     authValidation.password.bind(authValidation),
//     authValidation.recoveryCode.bind(authValidation),
//     errorsOfValidate,
//     async (req: Request, res: Response) => {
//
//     await authService.createNewPassword(req.body)
//
//     return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
// })

// authRouters.post('/refresh-token',
//     checkRefreshToken,
//     async (req: Request, res: Response) => {
//
//     const payload = await jwtService.getPayloadRefreshToken(req.cookies.refreshToken)
//     const accessToken = await jwtService.createAccessToken(payload!.userId)
//     const newRefreshToken = await jwtService.createRefreshToken(payload!.userId, payload!.deviceId)
//
//     return res
//         .cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
//         .status(constants.HTTP_STATUS_OK)
//         .send(accessToken)
// })

// authRouters.post('/logout',
//     checkRefreshToken,
//     async (req: Request, res: Response) => {
//
//     const payload = await jwtService.getPayloadRefreshToken(req.cookies.refreshToken)
//
//     await deviceSessionService.deleteDeviceSessionByDeviceId(payload!.deviceId)
//
//     return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
// })

// authRouters.get('/me',
//     authAccessToken,
//     async (req: Request, res: Response) => {
//
//     return res.status(constants.HTTP_STATUS_OK).send(req.user!)
// })