import {PostModelOutType} from "../types/types";
import {defaultPost, idNumber} from "../variables/variables";
//-----------------------------------------------------//
const postsDataBase: PostModelOutType[] = [defaultPost]
//-----------------------------------------------------//
export const postsRepository = {
    getAllPosts(): PostModelOutType[] {
        return postsDataBase
    },
    getPostById(id: string): PostModelOutType | undefined {
        return  postsDataBase.find(b => b.id === id)
    },
    createPost(body: any): PostModelOutType {
        const newPost = {
            id: idNumber(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: 'name'
        }
        postsDataBase.push(newPost)
        return newPost
    },
    updatePost(id: string, body: any): Boolean {
        const foundPost = postsDataBase.find(b => b.id === id)
        if (foundPost) {
            foundPost.title = body.title
            foundPost.shortDescription = body.shortDescription
            foundPost.content = body.content
            foundPost.blogId = body.blogId
            return true
        }
        return false
    },
    deletePostById(id: string): Boolean {
        const indexPost = postsDataBase.findIndex(b => b.id === id)
        if (indexPost !== -1) {
            postsDataBase.splice(indexPost, 1)
            return true
        }
        return false
    },
    deleteAll(): void {
        postsDataBase.splice(0, postsDataBase.length)
    }
}
