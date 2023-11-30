import jwt, {JwtPayload, Secret} from 'jsonwebtoken'
import {ViewTokenModelType, UserDBType} from "../types/users-types";

const secretAccess: Secret = process.env.SECRET_KEY!
const secretRefresh: Secret = process.env.SECRET_KEY!

export const jwtService = {

    async createAccessJWT(user: UserDBType): Promise<ViewTokenModelType> {

        const accessToken = await jwt
            .sign({userId: user._id},
                secretAccess,
                {expiresIn: '100s'})

        return {accessToken: accessToken}
    },

    async createRefreshJWT(user: UserDBType): Promise<string> {
        return jwt
            .sign({userId: user._id},
                secretRefresh,
                {expiresIn: '20s'})
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

    }
}