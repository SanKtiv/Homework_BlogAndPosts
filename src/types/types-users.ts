export type UserType = {
    login: string
    email: string
    createdAt: string
}

export type IdUserType = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type InputUserType = {
    login: string
    password: string
    email: string
}

export type InputLoginType = {
    loginOrEmail: string
    password: string
}