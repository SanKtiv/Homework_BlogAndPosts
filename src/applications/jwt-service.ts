import jwt, {JwtPayload, Secret} from 'jsonwebtoken'
import {ViewTokenModelType} from "../types/users-types";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-mongodb";

const secretAccess: Secret = process.env.SECRET_KEY!
const secretRefresh: Secret = process.env.SECRET_KEY!

export const jwtService = {

    async createAccessToken(userId: string): Promise<ViewTokenModelType> {
        const secretAccess: Secret = process.env.SECRET_KEY!
        const accessToken = await jwt
            .sign({userId: userId}, secretAccess, {expiresIn: '10s'})
        return {accessToken: accessToken}
    },

    async createRefreshToken(userId: string, deviceId: string): Promise<string> {
        const secretRefresh: Secret = process.env.SECRET_KEY!
        const payload = {deviceId: deviceId, userId: userId}
        return jwt.sign(payload, secretRefresh, {expiresIn: '20s'})
    },

    async getPayloadRefreshToken(token: string): Promise<JwtPayload | null> {
        const secret: Secret = process.env.SECRET_KEY!
        try {
            return jwt.verify(token, secret) as JwtPayload
        }
        catch (error) {
            return null
        }
    },

    async getPayloadAccessToken(token: string): Promise<JwtPayload | null> {
        const secret: Secret = process.env.SECRET_KEY!
        try {
            return jwt.verify(token, secret) as JwtPayload
        }
        catch (error) {
            return null
        }
    },

    // async getDeviceIdFromRefreshToken(token: string) {
    //     const payloadRefreshToken = await this.getPayloadRefreshToken(token)
    //     if (payloadRefreshToken) return payloadRefreshToken.deviceId
    //     return null
    // },
    //
    // async getUserIdByToken(token: string) {
    //     try {
    //         const result = await jwt.verify(token, secretAccess)
    //         if (typeof result !== 'string') return result.userId
    //     }
    //     catch (error) {
    //         return null
    //     }
    // },
    //
    // async checkRefreshToken(token: string) {
    //     try {
    //         const result = await jwt.verify(token, secretRefresh)
    //         if (typeof result !== 'string') return result.userId
    //     }
    //     catch (error) {
    //         return null
    //     }
    // },
    //
    // async getInvalidRefreshJWT (refreshJWT: string): Promise<boolean> {
    //     const invalidToken = await usersRepository.getInvalidRefreshJWT(refreshJWT)
    //     return !!invalidToken
    // }
}