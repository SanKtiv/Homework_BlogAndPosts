import jwt from 'jsonwebtoken'
import {ViewTokenModelType, UserDBType} from "../types/users-types";

const secret = process.env.SECRET_KEY || "undefined"

export const jwtService = {

    async createJWT(user: UserDBType): Promise<ViewTokenModelType> {

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