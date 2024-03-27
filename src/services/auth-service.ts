import {InputUserAuthModelType, PasswordRecoveryInputType} from "../types/users-types";
import bcrypt from 'bcrypt'
import {UsersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {UsersQueryRepository} from "../repositories/mongodb-repository/users-mongodb/users-query-mongodb";

export class AuthService {

    constructor(protected usersQueryRepository: UsersQueryRepository,
                protected usersRepository: UsersRepository) {
    }

    async checkCredentials(LoginBody: InputUserAuthModelType): Promise<string | null> {

        const user = await this
            .usersQueryRepository.getUserByLoginOrEmail(LoginBody.loginOrEmail)

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

        const user = await this.usersQueryRepository.getUserByConfirmationCode(code)

        if (!user) return false

        if (user.emailConfirmation.expirationDate < new Date()) return false

        return this.usersRepository.updateUserExpirationDate(user._id)
    }

    async changeConfirmationCode(email: string): Promise<boolean> {

        const newConfirmationCode = uuidv4()

        const newExpirationDate = add(new Date(), {hours: 1, minutes: 5})

        return this.usersRepository.updateUserConfirmationCode(newConfirmationCode, email,newExpirationDate)
    }

    async createRecoveryCode(email: string): Promise<string> {

        const passwordRecovery = {
            recoveryCode: uuidv4(),
            expirationDate: add(new Date(), {hours: 1, minutes: 5})
        }

        await this.usersRepository.addRecoveryCode(email, passwordRecovery)

        return passwordRecovery.recoveryCode
    }

    async getExpDateOfRecoveryCode(recoveryCode: string) {

        const user = await this.usersQueryRepository
            .getUserByRecoveryCode(recoveryCode)

        if (!user || !user.passwordRecovery) return null

        return user.passwordRecovery.expirationDate
    }

    async createNewPassword(passwordRecovery: PasswordRecoveryInputType) {

        const passwordHash = await this.genHash(passwordRecovery.newPassword)

        await this.usersRepository
            .insertNewPasswordHash(passwordRecovery.recoveryCode, passwordHash)
    }

    async recoveryPassword(email: string) {

        await this.usersRepository.resetPasswordHash(email)
    }
}