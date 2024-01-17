import {UserSessionType, UserSessionTypeDB} from "../types/security-device-types";
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
    }
}