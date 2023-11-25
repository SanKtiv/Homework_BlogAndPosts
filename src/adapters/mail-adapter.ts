import nodemailer from "nodemailer";
import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb-Query";
import {authService} from "../services/auth-service";

export const emailAdapter = {

    async sendConfirmationCodeByEmail(email: string) {

        const user = await usersRepositoryReadOnly.getUserByLoginOrEmail(email)
        if (!user) return null // User dont find
        const confirmationCode = user.emailConfirmation.confirmationCode
        //console.log(confirmationCode)

        const message = '<h1>Thank for your registration</h1>\n' +
            ' <p>To finish registration please follow the link below:\n' +
            `     <a href=\`https://somesite.com/confirm-email?code=${confirmationCode}\`>complete registration</a>\n` +
            ' </p>'
        const subject = 'confirmation registration'

        const mailOptions = {
            from: 'Aleksandr <aleksandr.mail.test@gmail.com>',
            to: email,
            subject: subject,
            html: message
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'aleksandr.mail.test@gmail.com',
                pass: 'rglgkegtcyunuxds'
            }
        })

        return transporter.sendMail(mailOptions)
    },
    
    async resendNewConfirmationCodeByEmail(email: string) {

        const result = await authService.changeConfirmationCode(email)
        if (result) await this.sendConfirmationCodeByEmail(email)
    }
}