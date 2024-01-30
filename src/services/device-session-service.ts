import {UserSessionType, UserSessionTypeDB} from "../types/security-device-types";
import {deviceSessionRepository} from "../repositories/mongodb-repository/user-session-mongodb";
import {jwtService} from "../applications/jwt-service";

export const deviceSessionService = {

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
    },

    async updateDatesDeviceSession(refreshToken: string) {

        const result = await jwtService.verifyJWT(refreshToken)

        if (!result) return null

        const lastActiveDate = new Date(result.iat! * 1000).toISOString()
        const expirationDate = new Date(result.exp! * 1000).toISOString()

        return deviceSessionRepository
            .updateDeviceSession(result.deviceId, lastActiveDate, expirationDate)
    },

    async getDeviceSessionByDeviceId(deviceId: string) {
        return deviceSessionRepository.getDeviceByDeviceId(deviceId)
    },

    async getAllUserSessions(refreshToken: string) {

        const viewUserSessions = []
        const result = await jwtService.verifyJWT(refreshToken)
        const userSessions = await deviceSessionRepository.getDeviceSessionsByUserId(result!.userId)

        for (const userSession of userSessions) {
            const viewUserSession = {
                ip: userSession.ip,
                title: userSession.title,
                deviceId: userSession._id.toString(),
                lastActiveDate: userSession.lastActiveDate
            }
            viewUserSessions.push(viewUserSession)
        }
        return viewUserSessions
    },

    async getDeviceIdFromRefreshToken(refreshToken: string) {
        const userSession = await jwtService.verifyJWT(refreshToken)
        return userSession!.deviceId
    },

    async deleteDeviceSessionByDeviceId(deviceId: string) {
        return deviceSessionRepository.deleteDeviceSessionByDeviceId(deviceId)
    },

    async deleteAllDevicesExcludeCurrent(refreshToken: string) {
        const result = await jwtService.verifyJWT(refreshToken)
        return deviceSessionRepository
            .deleteAllDevicesExcludeCurrent(result!.deviceId, result!.userId)
    }
}