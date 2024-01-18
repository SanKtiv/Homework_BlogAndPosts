import {UserSessionType, UserSessionTypeDB, ViewModelUserSessionType} from "../types/security-device-types";
import {userSessionRepository} from "../repositories/mongodb-repository/user-session-mongodb";
import {jwtService} from "../applications/jwt-service";

export const userSessionService = {

    async createUserSession(title: string, ip: string, userId: string,): Promise<string> {

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

        return userSessionRepository.updateUserSession(result.deviceId, result.iat!.toString(), result.exp!.toString())
    },

    async getAllUserSessions(refreshToken: string) {

        const viewUserSessions = []
        const userId = (await jwtService.verifyJWT(refreshToken)).userId
        const userSessions = await userSessionRepository.getAllUserSessionsByUserId(userId)

        for (const userSession of userSessions) {
            const viewUserSession = {
                ip: userSession.ip,
                title: userSession.title,
                deviseId: userSession._id.toString(),
                lastActiveDate: userSession.lastActiveDate
            }
            viewUserSessions.push(viewUserSession)
        }

        return viewUserSessions
    }
}