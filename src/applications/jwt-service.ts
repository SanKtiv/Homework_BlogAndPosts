import jwt, {JwtPayload, Secret} from 'jsonwebtoken'
import {ViewTokenModelType} from "../types/users-types";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-mongodb";
//import {n} from "../middlewares/authorization-jwt";

const secretAccess: Secret = process.env.SECRET_KEY!
const secretRefresh: Secret = process.env.SECRET_KEY!

export const jwtService = {

    async createAccessJWT(userId: string): Promise<ViewTokenModelType> {

        const accessToken = await jwt
            .sign({userId: userId}, secretAccess, {expiresIn: '10s'})

        return {accessToken: accessToken}
    },

    async createRefreshJWT(userId: string, deviceId: string): Promise<string> {

        const payload = {deviceId: deviceId, userId: userId}
        const token = await jwt
            .sign(payload, secretRefresh, {expiresIn: '20s'})

        return token
    },

    async verifyJWT(token: string): Promise<JwtPayload> {

        const secret: Secret = process.env.SECRET_KEY!
        return jwt.verify(token, secret) as JwtPayload
    },

    async getUserIdByToken(token: string) {

        try {

            const result = await jwt.verify(token, secretAccess)
            if (typeof result !== 'string') return result.userId

        } catch (error) {
            return null
        }

    },

    async checkRefreshToken(token: string) {

        try {

            const result = await jwt.verify(token, secretRefresh)

            if (typeof result !== 'string') return result.userId

        } catch (error) {
            return null
        }

    },

    async getInvalidRefreshJWT (refreshJWT: string): Promise<boolean> {
        const invalidToken = await usersRepository.getInvalidRefreshJWT(refreshJWT)
        //console.log(`Запуск №:${n}`, invalidToken)
        return !!invalidToken
    }
}