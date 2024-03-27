import nodemailer from "nodemailer";
import {UsersQueryRepository} from "../repositories/mongodb-repository/users-mongodb/users-query-mongodb";
import {AuthService} from "../services/auth-service";
import {passwordRecovery, registrationConfirmation} from "../utility/email-utilits";

export class EmailAdapter {

    constructor(protected usersQueryRepository: UsersQueryRepository,
                protected authService: AuthService) {}

    async sendConfirmationCodeByEmail(email: string) {

        const user = await this.usersQueryRepository.getUserByLoginOrEmail(email)

        if (!user) return null // User dont find

        const confirmationCode = user.emailConfirmation.confirmationCode

        const mailOptions = registrationConfirmation.mailOptions(email, confirmationCode)

        let transporter = nodemailer.createTransport(registrationConfirmation.mailTransport)

        return transporter.sendMail(mailOptions)
    }

    async resendNewConfirmationCodeByEmail(email: string): Promise<void> {

        const result = await this.authService.changeConfirmationCode(email)

        if (result) await this.sendConfirmationCodeByEmail(email)
    }

    async sendRecoveryCode(email: string) {

        const recoveryCode = await this.authService.createRecoveryCode(email)

        const mailOptions = passwordRecovery.mailOptions(email, recoveryCode)

        let transporter = nodemailer.createTransport(passwordRecovery.mailTransport)

        return transporter.sendMail(mailOptions)
    }
}

// export const emailAdapter = {
//
//     // async sendConfirmationCodeByEmail(email: string) {
//     //
//     //     const user = await usersQueryRepository.getUserByLoginOrEmail(email)
//     //
//     //     if (!user) return null // User dont find
//     //
//     //     const confirmationCode = user.emailConfirmation.confirmationCode
//     //
//     //     const mailOptions = registrationConfirmation.mailOptions(email, confirmationCode)
//     //
//     //     let transporter = nodemailer.createTransport(registrationConfirmation.mailTransport)
//     //
//     //     return transporter.sendMail(mailOptions)
//     // },
//
//     // async resendNewConfirmationCodeByEmail(email: string): Promise<void> {
//     //
//     //     const result = await authService.changeConfirmationCode(email)
//     //
//     //     if (result) await this.sendConfirmationCodeByEmail(email)
//     // },
//
//     // async sendRecoveryCode(email: string) {
//     //
//     //     const recoveryCode = await authService.createRecoveryCode(email)
//     //
//     //     const mailOptions = passwordRecovery.mailOptions(email, recoveryCode)
//     //
//     //     let transporter = nodemailer.createTransport(passwordRecovery.mailTransport)
//     //
//     //     return transporter.sendMail(mailOptions)
//     // }
// }