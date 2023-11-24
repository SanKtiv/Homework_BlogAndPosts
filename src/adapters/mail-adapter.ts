import nodemailer from "nodemailer";

export const emailAdapter = {

    async sendConfirmationMessage(email: string, subject: string, message: string) {

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'aleksandr.mail.test@gmail.com',
                pass: 'rglgkegtcyunuxds'
            }
        })

        const mailOptions = {
            from: 'Aleksandr <aleksandr.mail.test@gmail.com>',
            to: email,
            subject: subject,
            html: message
        }

        return transporter.sendMail(mailOptions)
    },

    // async resendConfirmationMessage(email: string) {
    //
    // }
}