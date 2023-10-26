import {PostModelOutType} from "../types/types";
import {idNumber} from "../variables/variables";
import {client} from "./db";
import {dateNow} from "../variables/variables";

export const postsRepository = {
    async getAllPosts(): Promise<PostModelOutType[]> {
        return client
            .db('tube')
            .collection<PostModelOutType>('posts')
            .find()
            .toArray()
    },
    async getPostById(id: string): Promise<PostModelOutType | null> {
        return client
            .db('tube')
            .collection<PostModelOutType>('posts')
            .findOne({id: id})
    },
    async createPost(body: any): Promise<PostModelOutType> {

        const newPost: PostModelOutType = {
            id: idNumber(),
            createdAt: dateNow.toISOString(),
            blogName: 'name',
            ...body}
        await client
            .db('tube')
            .collection<PostModelOutType>('posts')
            .insertOne(newPost)
        return newPost
    },
    async updatePost(id: string, body: any): Promise<Boolean> {
        const foundPost = await client
            .db('tube')
            .collection('posts')
            .updateOne({id: id}, {
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

        const deletePost = await client
            .db('tube')
            .collection('posts')
            .deleteOne({id: id})
        return deletePost.deletedCount === 1
    },
    async deleteAll(): Promise<void> {
        await client.db('tube')
            .collection('posts')
            .deleteMany({})
    }
}
