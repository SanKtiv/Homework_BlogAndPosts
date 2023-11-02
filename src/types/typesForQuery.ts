import {BlogModelOutType} from "./typesForMongoDB";

export type RequestQueryType = {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
}

export type BlogsOutputQueryType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogModelOutType[]
}