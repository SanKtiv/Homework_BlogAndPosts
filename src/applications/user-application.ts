import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb/users-mongodb-Query";
import {UserDBType} from "../types/users-types";

export const userApplication = {

    async createReqUserByUserId(userId: string) {

        const user = await usersRepositoryReadOnly.getUserById(userId)
        if (!user) return null

        return {
            email: user.accountData.email,
            login: user.accountData.login,
            userId: user._id.toString()
        }
    },

    async getUserInfo(email: string, login: string, userId: string) {

        return {
            email: email,
            login: login,
            userId: userId
        }
    },

    async getUserByUserId(userId: string): Promise<string | null> {

        const user = await usersRepositoryReadOnly.getUserById(userId)
        if (user) return user._id.toString()
        return null
    }
}
