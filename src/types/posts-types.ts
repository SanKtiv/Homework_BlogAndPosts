import {WithId} from "mongodb";

export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: ExtendedLikesInfoType
    userLikes: UserLikes[]
}

export type ExtendedLikesInfoType = {
    likesCount: number
    dislikesCount: number
}

type UserLikes = {
    userStatus: string | null
    addedAt: string | null
    userId: string | null
    login: string | null
}

export type ViewPostModelType = PostType & {id: string}

export type PostDBType = WithId<PostType>

export type InputPostModelType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type PostBodyWithoutBlogIdType = {
    title: string
    shortDescription: string
    content: string
}

export type InputPostsPagingType = {
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: string
    pageSize: string
}

export type ViewPostsPagingType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: ViewPostModelType[]
}
