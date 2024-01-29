import {UserSessionType, UserSessionTypeDB, ViewModelUserSessionType} from "../types/security-device-types";
import {userSessionRepository} from "../repositories/mongodb-repository/user-session-mongodb";
import {jwtService} from "../applications/jwt-service";
import {JwtPayload} from "jsonwebtoken";

export const userSessionService = {

    async createDeviceInUserSession(title: string, ip: string, userId: string,): Promise<string> {

        const userSession: UserSessionType = {
            ip: ip,
            title: title,
            userId: userId,
            lastActiveDate: 'Date.now().toString()',
            expirationDate: 'Date.now().toString()'
        }

        const userSessionDB: UserSessionTypeDB = await userSessionRepository
            .insertUserSession(userSession)

        return userSessionDB._id.toString()
    },

    async updateUserSession(refreshToken: string) {

        const result = await jwtService.verifyJWT(refreshToken)

        if (!result) return null

        const lastActiveDate = new Date(result.iat! * 1000).toISOString()
        const expirationDate = new Date(result.exp! * 1000).toISOString()

        return userSessionRepository
            .updateUserSession(result.deviceId, lastActiveDate, expirationDate)
    },

    async getDeviceSessionByDeviceId(deviceId: string) {
        return userSessionRepository.getDeviceByDeviceId(deviceId)
    },

    async getAllUserSessions(refreshToken: string) {

        const viewUserSessions = []
        const result = await jwtService.verifyJWT(refreshToken)
        const userSessions = await userSessionRepository.getAllUserSessionsByUserId(result!.userId)

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

        return userSessionRepository.deleteDeviceSessionByDeviceId(deviceId)
    },

    async deleteAllDevicesExcludeCurrent(refreshToken: string) {

        const result = await jwtService.verifyJWT(refreshToken)

        return userSessionRepository
            .deleteAllDevicesExcludeCurrent(result!.deviceId, result!.userId)
    }
}