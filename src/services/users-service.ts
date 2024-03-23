import {ViewUserModelType, UserDBType, InputUserModelType} from "../types/users-types";
import {UsersRepository, usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {authService} from "./auth-service";

export class UsersService {

    private usersRepository: UsersRepository

    constructor() {
        this.usersRepository = new UsersRepository()
    }

    async createSuperUser(body: InputUserModelType): Promise<UserDBType> {

        const superUser = await authService.createUser(body)

        superUser.emailConfirmation.isConfirmed = true

        return this.usersRepository.insertUserToDB(superUser)

    }

    // createViewUserModel(user: UserDBType): ViewUserModelType {
    //
    //     return {
    //         id: user._id.toString(),
    //         login: user.accountData.login,
    //         email: user.accountData.email,
    //         createdAt: user.accountData.createdAt
    //     }
    // }

    async deleteUserById(id: string): Promise<boolean> {

        return this.usersRepository.deleteUserById(id)
    }
}

export const usersService = new UsersService()