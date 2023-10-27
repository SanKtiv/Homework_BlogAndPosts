export type BlogModelOutType = {
    _id?: any,
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PostModelOutType = {
    _id?: any,
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type ErrorType = {
    errorsMessages: ErrorMessType[]
}
export type ErrorMessType = {
    message: string
    field: string
}
