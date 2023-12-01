import jwt, {JwtPayload, Secret} from 'jsonwebtoken'
import {ViewTokenModelType, UserDBType, RefreshTokenDBType} from "../types/users-types";
import {dateNow} from "../variables/variables";
import {authService} from "../services/auth-service";
import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb/users-mongodb-Query";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-mongodb";
import {n} from "../middlewares/authorization-jwt";

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
            .sign({userId: user._id}, secretRefresh, {expiresIn: '20s'})

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
            if (typeof result !== 'string') return result.userId

        } catch (error) {
            return null
        }

    },

    async getInvalidRefreshJWT (refreshJWT: string): Promise<boolean> {
        const invalidToken = await usersRepository.getInvalidRefreshJWT(refreshJWT)
        console.log(`Запуск №:${n}`, invalidToken)
        return !!invalidToken
    }
}