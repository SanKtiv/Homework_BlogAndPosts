import jwt from 'jsonwebtoken'
import {ViewTokenModelType, UserDBType} from "../types/users-types";

export const jwtService = {

    async createAccessJWT(user: UserDBType): Promise<ViewTokenModelType> {

        const accessToken = await jwt
            .sign({userId: user._id},
                process.env.SECRET_KEY || 'hello',
                {expiresIn: '10s'})

        return {accessToken: accessToken}
    },

    async createRefreshJWT(user: UserDBType): Promise<string> {
        return jwt
            .sign({userId: user._id},
                process.env.SECRET_KEY || 'hello',
                {expiresIn: '20s'})
    },

    async getUserIdByToken(token: string) {
        try {
            const userId = await jwt.verify(token, process.env.SECRET_KEY || 'hello')
            return userId.toString()
        } catch (error) {
            return null
        }
    }
}