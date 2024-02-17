import {ViewUserModelType, UserDBType, InputUserModelType, UserType} from "../types/users-types";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {authService} from "./auth-service";

export const userService = {

    async createSuperUser(body: InputUserModelType): Promise<ViewUserModelType> {

        const superUser = await authService.createUser(body)

        superUser.emailConfirmation.isConfirmed = true

        const userFromDB = await usersRepository.insertUserToDB(superUser)

        return this.createViewUserModel(userFromDB)
    },

    createViewUserModel(user: UserDBType): ViewUserModelType {

        return {
            id: user._id.toString(),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    },

    async deleteUserById(id: string): Promise<boolean> {

        return usersRepository.deleteUserById(id)
    },
}