import {PostType, PostBodyType, PostModelOutType} from "../types/typesForMongoDB";
import {dbPostsCollection} from "./db";
import {dateNow} from "../variables/variables";
import {ObjectId, WithId} from "mongodb";

export const postsRepository = {
    postDbInToBlog(postOutDb: WithId<PostType>): PostModelOutType {
    const {_id, ...withOutId} = postOutDb
    return  {id:postOutDb._id.toString(), ...withOutId}

},
    async getAllPosts(): Promise<PostModelOutType[]> {
        const allPosts = await dbPostsCollection.find().toArray()
        return allPosts.map(postOutDb => this.postDbInToBlog(postOutDb))
    },

    async getPostById(id: string): Promise<PostModelOutType | null> {
        const postOutDb = await dbPostsCollection.findOne({_id: new ObjectId(id)})
        if (postOutDb === null) return null
        return this.postDbInToBlog(postOutDb)
    },

    async createPost(body: PostBodyType): Promise<PostModelOutType> {
        const newPost: PostType = {
            createdAt: dateNow.toISOString(),
            blogName: 'name',
            ...body
        }
        await dbPostsCollection.insertOne(newPost)
        return this.postDbInToBlog(newPost as WithId<PostType>)
    },

    async updatePost(id: string, body: PostBodyType): Promise<Boolean> {
        const foundPost = await dbPostsCollection.updateOne({_id: new ObjectId(id)}, {
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

        const deletePost = await dbPostsCollection.deleteOne({_id: new ObjectId(id)})
        return deletePost.deletedCount === 1
    },
    async deleteAll(): Promise<void> {
        await dbPostsCollection.deleteMany({})
    }
}
