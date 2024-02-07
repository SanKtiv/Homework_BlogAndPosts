export const registrationConfirmation = {
    mailOptions(email: string, confirmationCode: any) {
        return {
            from: 'Aleksandr <aleksandr.mail.test@gmail.com>',
            to: email,
            subject: 'confirmation registration',
            html: this.message(confirmationCode)
        }
    },

    message(confirmationCode: any) {
        const message = '<h1>Thank for your registration</h1>\n' +
            ' <p>To finish registration please follow the link below:\n' +
            `     <a href=\`https://somesite.com/confirm-email?code=${confirmationCode}\`>complete registration</a>\n` +
            ' </p>'
        return message
    },

    mailTransport: {
        service: 'gmail',
        auth: {
            user: 'aleksandr.mail.test@gmail.com',
            pass: 'rglgkegtcyunuxds'
        }
    }
}

export const passwordRecovery = {
    mailOptions(email: string, recoveryCode: any) {
        return {
            from: 'Aleksandr <aleksandr.mail.test@gmail.com>',
            to: email,
            subject: 'Password recovery',
            html: this.message(recoveryCode)
        }
    },

    message(recoveryCode: any) {
        const message = '<h1>Password recovery</h1>\n' +
            ' <p>To finish password recovery please follow the link below:\n' +
            `     <a href=https://somesite.com/password-recovery?recoveryCode=${recoveryCode}>recovery password</a>\n` +
            ' </p>'
        return message
    },

    mailTransport: {
        service: 'gmail',
        auth: {
            user: 'aleksandr.mail.test@gmail.com',
            pass: 'rglgkegtcyunuxds'
        }
    }
}

export const mailData = {

    confirmRegSubject: 'confirmation registration',

    passwordRecoverySubject: 'Password recovery',

    confirmRegMessage(confirmationCode: any) {
        const message = '<h1>Thank for your registration</h1>\n' +
        ' <p>To finish registration please follow the link below:\n' +
        `     <a href=\`https://somesite.com/confirm-email?code=${confirmationCode}\`>complete registration</a>\n` +
        ' </p>'
        return message
    },

    passwordRecoveryMessage(recoveryCode: any) {
        const message = '<h1>Password recovery</h1>\n' +
            ' <p>To finish password recovery please follow the link below:\n' +
            `     <a href='https://somesite.com/password-recovery?recoveryCode='${recoveryCode}>recovery password</a>\n` +
            ' </p>'
        return message
    },
}