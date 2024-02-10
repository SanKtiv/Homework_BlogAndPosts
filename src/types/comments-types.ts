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
    likesInfo: LikesInfoType
    usersStatuses?: UserStatusType[]
}

export type CommentDBType = WithId<CommentType>

type CommentatorInfoType = {
    userId: string
    userLogin: string
}

type LikesInfoType = {
    likesCount: number
    dislikesCount: number
}

type UserStatusType = {
    userId: string
    userStatus: 'None' | 'Like' | 'Dislike'
}

export type ViewCommentPagingType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: ViewCommentModelType[]
}