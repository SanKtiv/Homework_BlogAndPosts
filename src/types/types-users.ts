import {WithId} from "mongodb";

export type UserType = {
    _id: string
    login: string
    email: string
    createdAt: string
    passwordHash: string
}

export type IdUserType = {
    id: string
    login: string
    email: string
    createdAt: string
}
export type User_Type = {
    accountData: AccountDataType
    emailConfirmation: EmailConfirmationType
}

type AccountDataType= {
    login: string
    email: string
    createdAt: string
    passwordHash: string
}

type EmailConfirmationType = {
    confirmationCode: any
    expirationDate: any
    isConfirmed: boolean
}

export type UserDBType = WithId<User_Type>

export type UserDbType = {
    login: string
    email: string
    createdAt: string
    passwordHash: string
}

export type InputUserType = {
    login: string
    password: string
    email: string
}

export type InputUserAuthType = {
    loginOrEmail: string
    password: string
}

export type OutputModelTokenType = {
    accessToken: string
}

export type UserQueryType = {
    searchLoginTerm: string | null
    searchEmailTerm: string | null
    sortBy: string
    sortDirection: string
    pageNumber: string
    pageSize: string
}

export type UsersOutputType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: IdUserType[]
}

export type OutputAcesAuthModelType = {
    email: string
    login: string
    userId: string
}