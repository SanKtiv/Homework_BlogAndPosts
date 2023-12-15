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

    sendBody(body: PostBodyType, blogId?: string) {
        return {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: !blogId ? body.blogId : blogId
        }
    },

    expectPost_TRUE() {
        return {
            ...this.body_TRUE,
            blogName: blog.body.name_TRUE,
            createdAt: expect.any(String)
        }
    },


}
