import {ObjectId} from "mongodb";
import {NUM} from "./blogs-utility";
import {blog} from "./blogs-utility";

type PostBodyType = {
    title: string | number
    shortDescription: string | number
    content: string | number
    blogId?: string | number
}

export const post = {

    id: new ObjectId(NUM).toString(),

    body_TRUE: {
        title: "post_title",
        shortDescription: "Qwerty",
        content: "content",
    },

    body_FALSE: {
        title: NUM,
        shortDescription: "description",
        content: "content",
        blogId: new ObjectId(NUM).toString()
    },

    bodyUpdate(blogId: string) {
            return {
                title: "TITLE",
                shortDescription: "QWERTY",
                content: "CONTENT",
                blogId: blogId
            }
        },

    paging: {
        preset1: {
            pageNumber: 1,
            pageSize: 5,
            sortBy:  'createdAt',
            sortDirection: 'desc'
        },
        preset2: {
            pageNumber: 2,
            pageSize: 5,
            sortBy:  'createdAt',
            sortDirection: 'asc'
        }
    },

    query(paging: any) {
        return `?` + Object.keys(paging).map(e => e + `=${paging[e]}`).join('&')
    },

    sendBody(body: PostBodyType, blogId?: string) {
        return {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: !blogId ? body.blogId : blogId
        }
    },

    sendManyBody(body: PostBodyType, postsCount: number, blogId?: string) {
        const arr = []
        for (let i = 1; i <= postsCount; i++) {
            arr.push({...this.sendBody(body, blogId), title: body.title + `${i}`})
        }
        return arr
    },

    expectPost_TRUE() {
        return {
            ...this.body_TRUE,
            blogName: blog.body.name_TRUE,
            createdAt: expect.any(String)
        }
    },

    expectDefaultPaging(manyBody: any) {
        const f = (sortBy: any) => Number(new Date(sortBy.createdAt))
        manyBody.sort((a: number, b: number) => f(b) - f(a))
        return {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: manyBody.length,
            items: manyBody.slice(0, 10)
        }
    },

    expectPaging(manyBody: any, paging: any) {

        const f = paging.sortBy === 'createdAt' ?
            (sortBy: any) => Number(new Date(sortBy.createdAt)) :
            (sortBy: any) => sortBy[paging.sortBy]

        const funcSort = paging.sortDirection === 'desc' ?
            (a: any, b: any) => f(b) - f(a) :
            (a: any, b: any) => f(a) - f(b)

        manyBody.sort(funcSort )

        return {
            pagesCount: Math.ceil(manyBody.length / paging.pageSize),
            page: paging.pageNumber,
            pageSize: paging.pageSize,
            totalCount: manyBody.length,
            items: manyBody.slice(0, paging.pageSize)
        }
    }


}
