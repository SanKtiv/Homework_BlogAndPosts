import {UserSessionType, UserSessionTypeDB} from "../types/security-device-types";
import {DeviceSessionRepository} from "../repositories/mongodb-repository/user-sessions-mongodb/user-session-mongodb";
import {JwtService} from "../applications/jwt-service";

export class DeviceSessionService {

    constructor(protected deviceSessionRepository: DeviceSessionRepository,
                protected jwtService: JwtService) {}

    async createDeviceSession(title: string, ip: string, userId: string,): Promise<string> {

        const userSession: UserSessionType = {
            ip: ip,
            title: title,
            userId: userId,
            lastActiveDate: 'Date.now().toString()',
            expirationDate: 'Date.now().toString()'
        }

        const userSessionDB: UserSessionTypeDB = await this.deviceSessionRepository
            .insertDeviceSession(userSession)

        return userSessionDB._id.toString()
    }

    async updateDatesDeviceSession(refreshToken: string) {

        const result = await this.jwtService.getPayloadRefreshToken(refreshToken)

        if (!result) return null

        const lastActiveDate = new Date(result.iat! * 1000).toISOString()
        const expirationDate = new Date(result.exp! * 1000).toISOString()

        return this.deviceSessionRepository
            .updateDeviceSession(result.deviceId, lastActiveDate, expirationDate)
    }

    async deleteDeviceSessionByDeviceId(deviceId: string) {

        return this.deviceSessionRepository.deleteDeviceSessionByDeviceId(deviceId)
    }

    async deleteAllDevicesExcludeCurrent(refreshToken: string) {

        const result = await this.jwtService.getPayloadRefreshToken(refreshToken)

        return this.deviceSessionRepository
            .deleteAllDevicesExcludeCurrent(result!.deviceId, result!.userId)
    }
}
