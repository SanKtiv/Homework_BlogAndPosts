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
        return `?` + Object.keys(paging).map(e => e + `${paging[e]}`).join('&')
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

    expectDefaultPaging(sendManyBody: any) {
        const arr = []

        return {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 10,
            items: [
                {
                    id: "string",
                    title: "string",
                    shortDescription: "string",
                    content: "string",
                    blogId: "string",
                    blogName: "string",
                    createdAt: "2023-12-19T06:46:40.542Z"
                }
            ]
        }
    },

    expectPostsPaging(body: PostBodyType, postsCount: number, paging?: any, blogId?: string) {
        if (paging) {

        }
        return {
            pagesCount: Math.ceil(postsCount / paging.pageSize),
            page: paging.pageNumber,
            pageSize: paging.pageSize,
            totalCount: postsCount,
            items: [
                {
                id: "string",
                title: "string",
                shortDescription: "string",
                content: "string",
                blogId: "string",
                blogName: "string",
                createdAt: "2023-12-19T06:46:40.542Z"
                }
            ]
        }
    }


}
