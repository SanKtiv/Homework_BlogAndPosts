import jwt, {Secret} from 'jsonwebtoken'
import {ViewTokenModelType, UserDBType} from "../types/users-types";

const secret = process.env.SECRET_KEY || 'String'

export const jwtService = {

    async createAccessJWT(user: UserDBType): Promise<ViewTokenModelType> {

        const accessToken = await jwt
            .sign({userId: user._id},
                secret,
                {expiresIn: '60s'})

        console.log('#1', user._id)
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
            const userId = await jwt.verify(token, secret)
            console.log('#3', userId)
            return userId.toString()
        } catch (error) {
            return null
        }
    }
}