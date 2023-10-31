import {BlogModelOutMemoryType} from "../types/typesForMemory";
import {idNumber} from "../variables/variables";
//-----------------------------------------------------//
const blogsDataBase: BlogModelOutMemoryType[] = []
//-----------------------------------------------------//
export const blogsRepository = {
    async getAllBlogs(): Promise<BlogModelOutMemoryType[]> {
        return blogsDataBase
    },
    async getBlogById(id: string): Promise<BlogModelOutMemoryType | undefined> {
        return  blogsDataBase.find(b => b.id === id)
    },
    async createBlog(body: any): Promise<BlogModelOutMemoryType> {
        const newBlog = {id: idNumber(), ...body}
        blogsDataBase.push(newBlog)
        return newBlog
    },
    async updateBlog(id: string, body: any): Promise<Boolean> {
        const foundBlog = blogsDataBase.find(b => b.id === id)
        if (foundBlog) {
            Object.assign(foundBlog, body)
            return true
        }
        return false
    },
    async deleteBlogById(id: string): Promise<Boolean> {
        const indexBlog = blogsDataBase.findIndex(b => b.id === id)
        if (indexBlog !== -1) {
            blogsDataBase.splice(indexBlog, 1)
            return true
        }
        return false
    },
    async deleteAll(): Promise<void> {
        blogsDataBase.splice(0, blogsDataBase.length)
    }
}
