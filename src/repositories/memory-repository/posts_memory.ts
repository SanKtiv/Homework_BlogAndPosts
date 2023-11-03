import {PostModelOutMemoryType} from "../../types/typesForMemory";
import {idNumber} from "../../variables/variables";
//-----------------------------------------------------//
const postsDataBase: PostModelOutMemoryType[] = []
//-----------------------------------------------------//
export const postsRepository = {
    getAllPosts(): PostModelOutMemoryType[] {
        return postsDataBase
    },
    getPostById(id: string): PostModelOutMemoryType | undefined {
        return  postsDataBase.find(b => b.id === id)
    },
    createPost(body: any): PostModelOutMemoryType {
        const newPost = {id: idNumber(), blogName: 'name', ...body}
        postsDataBase.push(newPost)
        return newPost
    },
    updatePost(id: string, body: any): Boolean {
        const foundPost = postsDataBase.find(b => b.id === id)
        if (foundPost) {
            Object.assign(foundPost, body)
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
