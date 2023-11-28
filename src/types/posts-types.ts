import {WithId} from "mongodb";

export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
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
