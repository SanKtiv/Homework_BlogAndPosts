export type CommentType = {
    id: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
}

export type CommentDBType = {
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
    postId: string
}

type CommentatorInfoType = {
    userId: string
    userLogin: string
}

export type PaginatorCommentViewModelType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentType[]
}