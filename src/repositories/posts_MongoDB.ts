import {PostModelOutType} from "../types/types";
import {idNumber} from "../variables/variables";
import {dbPostsCollection} from "./db";
import {dateNow} from "../variables/variables";

export const postsRepository = {
    async getAllPosts(): Promise<PostModelOutType[]> {
        return dbPostsCollection.find({}, {projection: {_id: 0}}).toArray()
    },
    async getPostById(id: string): Promise<PostModelOutType | null> {
        return dbPostsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
    async createPost(body: any): Promise<PostModelOutType> {

        const newPost: PostModelOutType = {
            id: idNumber(),
            createdAt: dateNow.toISOString(),
            blogName: 'name',
            ...body}
        await dbPostsCollection.insertOne(newPost)
        let {_id, ...newPostWithout_id} = newPost
        return newPostWithout_id
    },
    async updatePost(id: string, body: any): Promise<Boolean> {
        const foundPost = await dbPostsCollection.updateOne({id: id}, {
            $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId
            }
        })
        return foundPost.matchedCount === 1
    },
    async deletePostById(id: string): Promise<Boolean> {

        const deletePost = await dbPostsCollection.deleteOne({id: id})
        return deletePost.deletedCount === 1
    },
    async deleteAll(): Promise<void> {
        await dbPostsCollection.deleteMany({})
    }
}
