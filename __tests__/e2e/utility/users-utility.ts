const user = {
    login_TRUE: 'Qwerty12',
    login_FALSE: 'Qwerty13',
    email_TRUE: 'qwerty@yandex.com',
    password_TRUE: 'Qwerty12',
    password_FALSE: 'Qwerty123'
}

export const userSendBody_TRUE = {
    login: user.login_TRUE,
    password: user.password_TRUE,
    email: user.email_TRUE
}

export const userSendAuthBody_TRUE = {
    loginOrEmail: user.login_TRUE,
    password: user.password_TRUE
}