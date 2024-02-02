export const sendingData = {
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
            `     <a href=\`https://somesite.com/password-recovery?recoveryCode=${recoveryCode}\`>recovery password</a>\n` +
            ' </p>'
        return message
    },
}