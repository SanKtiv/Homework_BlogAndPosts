import {WithId} from "mongodb";

export type BlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type ViewBlogModelType = BlogType & {id: string}

export type BlogDBType = WithId<BlogType>

export type InputBlogModelType = {
    name: string
    description: string
    websiteUrl: string
}

export type InputBlogsPagingType = {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: string
    pageSize: string
}

export type ViewBlogsPagingType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: ViewBlogModelType[]
}