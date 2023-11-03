import {BlogModelOutType} from "./typesForMongoDB";
import {PostModelOutType} from "./typesForMongoDB";

export type InputQueryWithSearchNameType = {
    searchNameTerm: string
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

export type InputQueryType = {
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