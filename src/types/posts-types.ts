import {ObjectId, WithId} from "mongodb";

export class PostType {
    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string,
                public extendedLikesInfo: ExtendedLikesInfoType,
                public userLikesInfo: WithId<UserLikesInfoType>[]) {
    }
}

export type ExtendedLikesInfoType = {
    likesCount: number
    dislikesCount: number
}

export type UserLikesInfoType = {
    userStatus: string
    addedAt: string
    userId: string
    login: string
}

export type ViewPostModelType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
        newestLikes: NewestLikesType[]
    }
}

type NewestLikesType = {
    addedAt: string
    userId: string
    login: string
}

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

export type TransactBodyType = {
    id: string
    likeStatus: string
    userId: string
    login: string
}
