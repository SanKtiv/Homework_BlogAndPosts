import {BlogModelOutType} from "./typesForMongoDB";
import {PostModelOutType} from "./typesForMongoDB";

export type BlogsInputPagingType = {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: string
    pageSize: string
}

export type BlogsOutputQueryType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogModelOutType[]
}

export type PostsByBlogIdInputPagingType = {
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: string
    pageSize: string
}

export type PostsOutputQueryType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostModelOutType[]
}