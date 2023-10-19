export type BlogModelOutType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export type BlogModelInType = {
    name: string
    description: string
    websiteUrl: string
}

export type ErrorType = {
    errorsMessages: ErrorMessType[]
}
type ErrorMessType = {
    message: string
    field: string
}
