import {WithId} from "mongodb";

export type UserType = {
    accountData: AccountDataType
    emailConfirmation: EmailConfirmationType
}

type AccountDataType = {
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

export type InputUserAuthModelType = {
    loginOrEmail: string
    password: string
}

export type InputUserModelType = {
    login: string
    password: string
    email: string
}

export type ViewUserModelType = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UserDBType = WithId<UserType>

export type ViewTokenModelType = {
    accessToken: string
}

export type InputUserPagingType = {
    searchLoginTerm: string | null
    searchEmailTerm: string | null
    sortBy: string
    sortDirection: string
    pageNumber: string
    pageSize: string
}

export type ViewUsersPagingType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: ViewUserModelType[]
}

export type RequestUserType = {
    email: string
    login: string
    userId: string
}

export type QueryPagingType = {
    searchLoginTerm?: string
    searchEmailTerm?: string
    pageNumber?: string
    pageSize?: string
    sortBy?: string
    sortDirection?: string
}