export type BlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type BlogModelOutType = BlogType & {id: string}

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

export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostModelOutType = PostType & {id: string}

export type ErrorType = {
    errorsMessages: ErrorMessType[]
}
export type ErrorMessType = {
    message: string
    field: string
}
