import {InputUserModelType, UserType, ViewUserModelType} from "../types/users-types";
import {WithId} from "mongodb";
import bcrypt from 'bcrypt'
import {dateNow} from "../variables/variables";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-mongodb";
import {userService} from "./users-service";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb/users-mongodb-Query";

export const authService = {

    async createUser(body: InputUserModelType): Promise<UserType> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.genHash(body.password, passwordSalt)

        return {
            accountData: {
                login: body.login,
                email: body.email,
                passwordHash,
                createdAt: dateNow().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 1, minutes: 5}),
                isConfirmed: false
            }
        }
    },

    async createSuperUser(body: InputUserModelType): Promise<UserType> {

        const user = await this.createUser(body)
        const superUser = {...user}
        superUser.emailConfirmation.isConfirmed = true
        return superUser
    },

    async addUserInDB(body: InputUserModelType): Promise<ViewUserModelType> {

        const user = await this.createUser(body)
        const findUser = await usersRepository.insertUserToDB(user)
        return userService.addIdToUser(findUser as WithId<UserType>)
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<UserType> | null> {

        const user = await usersRepositoryReadOnly.getUserByLoginOrEmail(loginOrEmail)
        if (!user) return user
        const result = await bcrypt.compare(password, user.accountData.passwordHash)
        if (result) return user
        return null
    },

    async genHash(password: string, salt: string) {

        return await bcrypt.hash(password, salt)
    },

    async confirmationRegistration(code: string): Promise<boolean> {

        const newCode = code.slice(0, code.length - 1)//!!!!!!!!!!!!!!!!!!!!!

        const user = await usersRepositoryReadOnly.getUserByConfirmationCode(newCode)
        if (!user) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        return usersRepository.updateUserExpirationDate(user._id)
    },

    async changeConfirmationCode(email: string) {

        const newConfirmationCode = uuidv4()
        const newExpirationDate = add(new Date(), {hours: 1, minutes: 5})
        return usersRepository.updateUserConfirmationCode(newConfirmationCode, email,newExpirationDate)
    }
}