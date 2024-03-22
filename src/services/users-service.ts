import {ViewUserModelType, UserDBType, InputUserModelType} from "../types/users-types";
import {UsersRepository, usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {authService} from "./auth-service";

export class UserService {

    private usersRepository: UsersRepository

    constructor() {
        this.usersRepository = new UsersRepository()
    }

    async createSuperUser(body: InputUserModelType): Promise<ViewUserModelType> {

        const superUser = await authService.createUser(body)

        superUser.emailConfirmation.isConfirmed = true

        const userFromDB = await this.usersRepository.insertUserToDB(superUser)

        return this.createViewUserModel(userFromDB)
    }

    createViewUserModel(user: UserDBType): ViewUserModelType {

        return {
            id: user._id.toString(),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    }

    async deleteUserById(id: string): Promise<boolean> {

        return this.usersRepository.deleteUserById(id)
    }
}

export const userService = new UserService()