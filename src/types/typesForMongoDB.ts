
export type BlogModelOutType = {
    //_id?: any,//типизировать
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type CreateBlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogBodyType = {
    name: string
    description: string
    websiteUrl: string
}

export type PostBodyType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type BlogModelInType = {
    name: {
        field: string
        length: number
    }
    description: {
        field: string
        length: number
    }
    websiteUrl: {
        field: string
        length: number
        pattern: RegExp
    }
}

export type PostModelOutType = {
    _id?: any,//типизировать
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
