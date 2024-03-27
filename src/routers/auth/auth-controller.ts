import {AuthService} from "../../services/auth-service";
import {JwtService} from "../../applications/jwt-service";
import {DeviceSessionService} from "../../services/device-session-service";
import {EmailAdapter} from "../../adapters/mail-adapter";
import {Request, Response} from "express";
import {constants} from "http2";

export class AuthController {

    constructor(protected authService: AuthService,
                protected jwtService: JwtService,
                protected deviceSessionService: DeviceSessionService,
                protected emailAdapter: EmailAdapter) {}

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