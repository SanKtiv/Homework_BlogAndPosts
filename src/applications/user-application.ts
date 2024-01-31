import {userService} from "../services/users-service";

export const userApplication = {

    async createReqUserByUserId(userId: string) {

        const user = await userService.getUserByUserId(userId)
        if (!user) return null

        return {
            email: user.accountData.email,
            login: user.accountData.login,
            userId: user._id.toString()
        }
    },

    async createUserInfo(email: string, login: string, userId: string) {

        return {
            email: email,
            login: login,
            userId: userId
        }
    },
}
