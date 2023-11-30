import jwt, {JwtPayload, Secret} from 'jsonwebtoken'
import {ViewTokenModelType, UserDBType} from "../types/users-types";
import {dateNow} from "../variables/variables";

const secretAccess: Secret = process.env.SECRET_KEY!
const secretRefresh: Secret = process.env.SECRET_KEY!

export const jwtService = {

    async createAccessJWT(user: UserDBType): Promise<ViewTokenModelType> {

        const accessToken = await jwt
            .sign({userId: user._id},
                secretAccess,
                {expiresIn: '10s'})

        return {accessToken: accessToken}
    },

    async createRefreshJWT(user: UserDBType): Promise<string> {
        const token = await jwt
            .sign({userId: user._id},
                secretRefresh,
                {expiresIn: '20s'})
        /////////////////////////////////////
        console.log('#1', token, await jwt.verify(token, secretRefresh))

        return token
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
            console.log('#2', token, result, Number(dateNow()))
            if (typeof result !== 'string') return result.userId

        } catch (error) {
            return null
        }

    }
}