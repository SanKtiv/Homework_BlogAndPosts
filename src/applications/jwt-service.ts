import jwt from 'jsonwebtoken'
import {ObjectId, WithId} from 'mongodb'
import {OutputModelTokenType, UserDbType} from "../types/types-users";

const secret = process.env.SECRET_KEY || "undefined"

export const jwtService = {

    async createJWT(user: WithId<UserDbType>): Promise<OutputModelTokenType> {

        const token = await jwt.sign({userId: user._id}, secret, {expiresIn: '1h'})
        return {accessToken: token}
    },

    async getUserIdByToken(token: string) {

        try {

            const result: any = await jwt.verify(token, secret)
            return result.userId

        } catch (error) {
            return null
        }
    }
}