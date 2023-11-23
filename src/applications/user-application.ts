import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb-Query";

export const userApplication = {

    async getUserById(userId: string) {

        const user = await usersRepositoryReadOnly.getUserById(userId)
        if (!user) return null

        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    },

    async getUserInfo(email: string, login: string, userId: string) {

        return {
            email: email,
            login: login,
            userId: userId
        }
    }
}
