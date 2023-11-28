import {InputBlogModelType, BlogType} from "../../../src/types/posts-types";

const blog = {
    name_TRUE: "blog_name",
    description_TRUE: "Qwerty12",
    websiteUrl_TRUE: "https://someurl.com"
}

export const blogSendBody_TRUE = {
    name: blog.name_TRUE,
    description: blog.description_TRUE,
    websiteUrl: blog.websiteUrl_TRUE
}

export const expectBlog_TRUE = {
    id: expect.any(String),
    name: blog.name_TRUE,
    description: blog.description_TRUE,
    websiteUrl: blog.websiteUrl_TRUE,
    createdAt: expect.any(String),
    isMembership: expect.any(Boolean)
}

export const manyBlogSendBody_TRUE = (n: number) => {
    const arr = []
    while (n > 0) {
        arr.push({...blogSendBody_TRUE, name: blog.name_TRUE + `${11 - n}`})
        n--
    }
    return arr
}

export const expectManyBlog_TRUE = (n: number, sortBy: string) => {
    const arr = []
    while (n > 0) {
        arr.push(
            {
                ...expectBlog_TRUE,
                name: blog.name_TRUE + `${11 - n}`,
                createdAt: sortBy
            })
        n--
    }
    return arr
}

export const viewModelBlogsDefaultPaging_TRUE = (n: number, items: BlogType[]) => {
    const fun = (a: any, b: any) => Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
    //const fun = (a: any, b: any) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
    const itemsSort = items.sort(fun)
    console.log('#2', itemsSort)
    return {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 10,
        items: itemsSort
    }
}