import {UserSessionType, UserSessionTypeDB} from "../types/security-device-types";
import {deviceSessionRepository} from "../repositories/mongodb-repository/user-sessions-mongodb/user-session-mongodb";
import {jwtService} from "../applications/jwt-service";

class DeviceSessionService {

    async createDeviceSession(title: string, ip: string, userId: string,): Promise<string> {

        const userSession: UserSessionType = {
            ip: ip,
            title: title,
            userId: userId,
            lastActiveDate: 'Date.now().toString()',
            expirationDate: 'Date.now().toString()'
        }

        const userSessionDB: UserSessionTypeDB = await deviceSessionRepository
            .insertDeviceSession(userSession)

        return userSessionDB._id.toString()
    }

    async updateDatesDeviceSession(refreshToken: string) {

        const result = await jwtService.getPayloadRefreshToken(refreshToken)

        if (!result) return null

        const lastActiveDate = new Date(result.iat! * 1000).toISOString()
        const expirationDate = new Date(result.exp! * 1000).toISOString()

        return deviceSessionRepository
            .updateDeviceSession(result.deviceId, lastActiveDate, expirationDate)
    }

    async deleteDeviceSessionByDeviceId(deviceId: string) {
        return deviceSessionRepository.deleteDeviceSessionByDeviceId(deviceId)
    }

    async deleteAllDevicesExcludeCurrent(refreshToken: string) {
        const result = await jwtService.getPayloadRefreshToken(refreshToken)
        return deviceSessionRepository
            .deleteAllDevicesExcludeCurrent(result!.deviceId, result!.userId)
    }
}

export const deviceSessionService = new DeviceSessionService()
