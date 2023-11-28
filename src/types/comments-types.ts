import {WithId} from "mongodb";

export type ViewCommentModelType = {
    id: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
}

export type CommentType = {
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
    postId: string
}

export type CommentDBType = WithId<CommentType>

type CommentatorInfoType = {
    userId: string
    userLogin: string
}

export type ViewCommentPagingType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: ViewCommentModelType[]
}