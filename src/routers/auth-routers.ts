import {Router, Request, Response} from "express";
import {AuthService, authService} from "../services/auth-service";
import {emailPasswordRecovery, userAuthValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {JwtService, jwtService} from "../applications/jwt-service";
import {authAccessToken, checkRefreshToken} from "../middlewares/authorization-jwt";
import {DeviceSessionService, deviceSessionService} from "../services/device-session-service";
import {apiRequests, countRequestsToApi} from "../middlewares/count-api-request-middleware";
import {EmailAdapter} from "../adapters/mail-adapter";
import {ValidNewPassword, ValidRecoveryCode} from "../validations/recovery-password-validators";
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
}

const authController = new AuthController()

authRouters.post('/login',
    countRequestsToApi.countRequests.bind(countRequestsToApi),
    ...userAuthValid,
    errorsOfValidate,
    authController.createAndSendAccessToken.bind(authController))

authRouters.post('/password-recovery',
    apiRequests,
    emailPasswordRecovery,
    authController.sendRecoveryCode.bind(authController))

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

authRouters.post('/new-password', apiRequests, ValidNewPassword, ValidRecoveryCode, errorsOfValidate, async (req: Request, res: Response) => {

    await authService.createNewPassword(req.body)

    return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
})

authRouters.post('/refresh-token', checkRefreshToken, async (req: Request, res: Response) => {

    const payload = await jwtService.getPayloadRefreshToken(req.cookies.refreshToken)
    const accessToken = await jwtService.createAccessToken(payload!.userId)
    const newRefreshToken = await jwtService.createRefreshToken(payload!.userId, payload!.deviceId)

    return res
        .cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
        .status(constants.HTTP_STATUS_OK)
        .send(accessToken)
})

authRouters.post('/logout', checkRefreshToken, async (req: Request, res: Response) => {

    const payload = await jwtService.getPayloadRefreshToken(req.cookies.refreshToken)

    await deviceSessionService.deleteDeviceSessionByDeviceId(payload!.deviceId)

    return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
})

authRouters.get('/me', authAccessToken, async (req: Request, res: Response) => {

    return res.status(constants.HTTP_STATUS_OK).send(req.user!)
})