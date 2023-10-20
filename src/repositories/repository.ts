
import {BlogModelOutType} from "../types/types";
import {defaultBlog, idNumber} from "../variables/variables";
//-----------------------------------------------------//
const blogsDataBase: BlogModelOutType[] = [defaultBlog]
//-----------------------------------------------------//
export const blogsRepository = {
    getAllBlogs(): BlogModelOutType[] {
        return blogsDataBase
    },
    getBlogById(id: string): BlogModelOutType | undefined {
        return  blogsDataBase.find(b => b.id === id)
    },
    createBlog(body: any): BlogModelOutType {
        const newBlog = {
            id: idNumber(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        blogsDataBase.push(newBlog)
        return newBlog
    },
    updateBlog(id: string, body: any): Boolean {
        const foundBlog = blogsDataBase.find(b => b.id === id)
        if (foundBlog) {
            foundBlog.name = body.name
            foundBlog.description = body.description
            foundBlog.websiteUrl = body.websiteUrl
            return true
        }
        return false
    },
    delleteBlogById(id: string): Boolean {
        const indexBlog = blogsDataBase.findIndex(b => b.id === id)
        if (indexBlog !== -1) {
            blogsDataBase.splice(indexBlog, 1)
            return true
        }
        return false
    }
}
