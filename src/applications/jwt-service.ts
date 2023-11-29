import jwt, {JwtPayload, Secret} from 'jsonwebtoken'
import {ViewTokenModelType, UserDBType} from "../types/users-types";

const secret: Secret = process.env.SECRET_KEY!

export const jwtService = {

    async createAccessJWT(user: UserDBType): Promise<ViewTokenModelType> {

        const accessToken = await jwt
            .sign({userId: user._id},
                secret,
                {expiresIn: '60s'})

        return {accessToken: accessToken}
    },

    async createRefreshJWT(user: UserDBType): Promise<string> {
        return jwt
            .sign({userId: user._id},
                secret,
                {expiresIn: '20s'})
    },

    async getUserIdByToken(token: string) {

        try {

            const result = await jwt.verify(token, secret)
            if (typeof result !== 'string') return result.userId

        } catch (error) {
            return null
        }

    }
}