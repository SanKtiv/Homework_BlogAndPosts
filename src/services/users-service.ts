import {UserDBType, InputUserModelType, UserType} from "../types/users-types";
import {UsersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {AuthService} from "./auth-service";
import {dateNow} from "../variables/variables";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export class UsersService {

    private usersRepository: UsersRepository
    private authService: AuthService

    constructor() {
        this.usersRepository = new UsersRepository()
        this.authService = new AuthService()
    }

    async createUser(body: InputUserModelType, isConfirmed?: boolean): Promise<UserDBType> {

        const passwordHash = await this.authService.genHash(body.password)

        if (!isConfirmed) isConfirmed = false

        const user: UserType = {
            accountData: {
                login: body.login,
                email: body.email,
                passwordHash,
                createdAt: dateNow().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 1, minutes: 5}),
                isConfirmed: isConfirmed
            }
        }

        await this.usersRepository.insertUserToDB(user)

        return user as UserDBType
    }

    async createSuperUser(body: InputUserModelType): Promise<UserDBType> {

        return this.createUser(body, true)
    }

    async deleteUserById(id: string): Promise<boolean> {

        return this.usersRepository.deleteUserById(id)
    }
}
//export const usersService = new UsersService()