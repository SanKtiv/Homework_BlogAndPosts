import {WithId} from "mongodb";

export class BlogType {
    constructor(public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string,
                public isMembership: boolean) {
    }
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