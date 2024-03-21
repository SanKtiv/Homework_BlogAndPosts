import nodemailer from "nodemailer";
import {usersQueryRepository} from "../repositories/mongodb-repository/users-mongodb/users-query-mongodb";
import {authService} from "../services/auth-service";
import {passwordRecovery, registrationConfirmation} from "../utility/email-utilits";

export const emailAdapter = {

    async sendConfirmationCodeByEmail(email: string) {

        const user = await usersQueryRepository.getUserByLoginOrEmail(email)
        if (!user) return null // User dont find
        const confirmationCode = user.emailConfirmation.confirmationCode

        // const message = '<h1>Thank for your registration</h1>\n' +
        //     ' <p>To finish registration please follow the link below:\n' +
        //     `     <a href=\`https://somesite.com/confirm-email?code=${confirmationCode}\`>complete registration</a>\n` +
        //     ' </p>'

        //const subject = 'confirmation registration'

        // const mailOptions = {
        //     from: 'Aleksandr <aleksandr.mail.test@gmail.com>',
        //     to: email,
        //     subject: mailData.confirmRegSubject,
        //     html: mailData.confirmRegMessage(confirmationCode)
        // }

        const mailOptions = registrationConfirmation.mailOptions(email, confirmationCode)

        let transporter = nodemailer.createTransport(registrationConfirmation.mailTransport)

        return transporter.sendMail(mailOptions)
    },
    
    async resendNewConfirmationCodeByEmail(email: string): Promise<void> {
        const result = await authService.changeConfirmationCode(email)
        if (result) await this.sendConfirmationCodeByEmail(email)
    },

    async sendRecoveryCode(email: string) {
        const recoveryCode = await authService.createRecoveryCode(email)
        const mailOptions = passwordRecovery.mailOptions(email, recoveryCode)
        let transporter = nodemailer.createTransport(passwordRecovery.mailTransport)
        return transporter.sendMail(mailOptions)
    }
}