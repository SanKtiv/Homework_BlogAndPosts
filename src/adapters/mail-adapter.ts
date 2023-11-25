import nodemailer from "nodemailer";
import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb-Query";

export const emailAdapter = {

    async sendConfirmationMessage(email: string) {

        const user = await usersRepositoryReadOnly.getUserByLoginOrEmail(email)
        if (!user) return null // User dont find
        const confirmationCode = user.emailConfirmation.confirmationCode

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
}