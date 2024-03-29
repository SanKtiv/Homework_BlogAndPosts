import jwt, {JwtPayload, Secret} from 'jsonwebtoken'
import {ViewTokenModelType} from "../types/users-types";

export class JwtService {

    async createAccessToken(userId: string): Promise<ViewTokenModelType> {

        const secretAccess: Secret = process.env.SECRET_KEY!

        const payload = {userId: userId}

        const accessToken = jwt.sign(payload, secretAccess, {expiresIn: '7m'})

        return {accessToken: accessToken}
    }

    async createRefreshToken(userId: string, deviceId: string): Promise<string> {

        const secretRefresh: Secret = process.env.SECRET_KEY!

        const payload = {deviceId: deviceId, userId: userId}

        return jwt.sign(payload, secretRefresh, {expiresIn: '1h'})

        //await deviceSessionService.updateDatesDeviceSession(refreshToken)

        //return refreshToken
    }

    async getPayloadRefreshToken(token: string): Promise<JwtPayload | null> {

        const secret: Secret = process.env.SECRET_KEY!

        try {

            return jwt.verify(token, secret) as JwtPayload

        } catch (error) {

            return null
        }
    }

    async getPayloadAccessToken(headersAuthorization: string): Promise<JwtPayload | null> {

        const accessToke = headersAuthorization.split(' ')[1]

        const secret: Secret = process.env.SECRET_KEY!

        try {

            return jwt.verify(accessToke, secret) as JwtPayload

        } catch (error) {

            return null
        }
    }
}

// export const jwtService = new JwtService()