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