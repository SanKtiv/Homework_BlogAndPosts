import {InputUserAuthModelType, PasswordRecoveryInputType} from "../types/users-types";
import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {usersQueryRepository} from "../repositories/mongodb-repository/users-mongodb/users-query-mongodb";

export class AuthService {

    async checkCredentials(LoginBody: InputUserAuthModelType): Promise<string | null> {

        const user = await usersQueryRepository.getUserByLoginOrEmail(LoginBody.loginOrEmail)
        if (!user) return null
        const result = await bcrypt.compare(LoginBody.password, user.accountData.passwordHash)
        if (!result) return null
        return user._id.toString()
    }

    async genHash(password: string): Promise<string> {

        const salt = await bcrypt.genSalt(10)

        return bcrypt.hash(password, salt)
    }

    async confirmationRegistration(code: string): Promise<boolean> {

        const user = await usersQueryRepository.getUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        return usersRepository.updateUserExpirationDate(user._id)
    }

    async changeConfirmationCode(email: string): Promise<boolean> {

        const newConfirmationCode = uuidv4()
        const newExpirationDate = add(new Date(), {hours: 1, minutes: 5})
        return usersRepository.updateUserConfirmationCode(newConfirmationCode, email,newExpirationDate)
    }

    async createRecoveryCode(email: string): Promise<string> {

        const passwordRecovery = {
            recoveryCode: uuidv4(),
            expirationDate: add(new Date(), {hours: 1, minutes: 5})
        }
        await usersRepository.addRecoveryCode(email, passwordRecovery)
        return passwordRecovery.recoveryCode
    }

    async getExpDateOfRecoveryCode(recoveryCode: string) {
        const user = await usersQueryRepository
            .getUserByRecoveryCode(recoveryCode)
        if (!user || !user.passwordRecovery) return null
        return user.passwordRecovery.expirationDate
    }

    async createNewPassword(passwordRecovery: PasswordRecoveryInputType) {

        const passwordHash = await this.genHash(passwordRecovery.newPassword)

        await usersRepository.insertNewPasswordHash(passwordRecovery.recoveryCode, passwordHash)
    }

    async recoveryPassword(email: string) {
        await usersRepository.resetPasswordHash(email)
    }
}

export const authService = {

    // async createUser(body: InputUserModelType): Promise<UserType> {
    //
    //     const passwordSalt = await bcrypt.genSalt(10)
    //     const passwordHash = await this.genHash(body.password, passwordSalt)
    //
    //     return {
    //         accountData: {
    //             login: body.login,
    //             email: body.email,
    //             passwordHash,
    //             createdAt: dateNow().toISOString()
    //         },
    //         emailConfirmation: {
    //             confirmationCode: uuidv4(),
    //             expirationDate: add(new Date(), {hours: 1, minutes: 5}),
    //             isConfirmed: false
    //         }
    //     }
    // },

    // async createSuperUser(body: InputUserModelType): Promise<UserType> {
    //
    //     const user = await this.createUser(body)
    //     const superUser = {...user}
    //     superUser.emailConfirmation.isConfirmed = true
    //     return superUser
    // },

    // async insertUserInDB(body: InputUserModelType): Promise<ViewUserModelType> {
    //
    //     const user = await this.createUser(body)
    //
    //     const findUser = await usersRepository.insertUserToDB(user)
    //
    //     return usersHandler.createUserViewModel(findUser)
    // },

    // async checkCredentials(LoginBody: InputUserAuthModelType): Promise<string | null> {
    //
    //     const user = await usersQueryRepository.getUserByLoginOrEmail(LoginBody.loginOrEmail)
    //     if (!user) return null
    //     const result = await bcrypt.compare(LoginBody.password, user.accountData.passwordHash)
    //     if (!result) return null
    //     return user._id.toString()
    // },

    async genHash(password: string, salt: string): Promise<string> {

        return bcrypt.hash(password, salt)
    },

    // async confirmationRegistration(code: string): Promise<boolean> {
    //
    //     const user = await usersQueryRepository.getUserByConfirmationCode(code)
    //
    //     if (!user) return false
    //
    //     if (user.emailConfirmation.expirationDate < new Date()) return false
    //
    //     return usersRepository.updateUserExpirationDate(user._id)
    // },

    // async changeConfirmationCode(email: string): Promise<boolean> {
    //
    //     const newConfirmationCode = uuidv4()
    //     const newExpirationDate = add(new Date(), {hours: 1, minutes: 5})
    //     return usersRepository.updateUserConfirmationCode(newConfirmationCode, email,newExpirationDate)
    // },

    // async createRecoveryCode(email: string): Promise<string> {
    //
    //     const passwordRecovery = {
    //         recoveryCode: uuidv4(),
    //         expirationDate: add(new Date(), {hours: 1, minutes: 5})
    //     }
    //     await usersRepository.addRecoveryCode(email, passwordRecovery)
    //     return passwordRecovery.recoveryCode
    // },

    async getExpDateOfRecoveryCode(recoveryCode: string) {
        const user = await usersQueryRepository
            .getUserByRecoveryCode(recoveryCode)
        if (!user || !user.passwordRecovery) return null
        return user.passwordRecovery.expirationDate
    },

    async createNewPassword(passwordRecovery: PasswordRecoveryInputType) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.genHash(passwordRecovery.newPassword, passwordSalt)
        await usersRepository.insertNewPasswordHash(passwordRecovery.recoveryCode, passwordHash)
    },

    // async recoveryPassword(email: string) {
    //     await usersRepository.resetPasswordHash(email)
    // }
}