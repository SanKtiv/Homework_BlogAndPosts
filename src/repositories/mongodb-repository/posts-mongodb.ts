import {PostType, PostBodyType, PostModelOutType, PostBodyWithoutBlogIdType} from "../../types/typesForMongoDB";
import {dbPostsCollection, dbCommentsCollection} from "./db";
import {dateNow} from "../../variables/variables";
import {ObjectId, WithId} from "mongodb";
import {postsService} from "../../services/posts-service";
import {CommentDBType, CommentType} from "../../types/types-comments";
import {commentService} from "../../services/commets-service";

export const postsRepository = {

    async getAllPosts(): Promise<PostModelOutType[]> {
        const allPosts = await dbPostsCollection.find().toArray()
        return allPosts.map(postOutDb => postsService.postDbInToBlog(postOutDb))
    },

    async getPostById(id: string): Promise<PostModelOutType | null> {
        const postOutDb = await dbPostsCollection.findOne({_id: new ObjectId(id)})
        if (postOutDb === null) return null
        return postsService.postDbInToBlog(postOutDb)
    },

    async createPost(body: PostBodyType): Promise<PostModelOutType> {
        const newPost: PostType = {
            createdAt: dateNow().toISOString(),
            blogName: 'name',
            ...body
        }
        await dbPostsCollection.insertOne(newPost)
        return postsService.postDbInToBlog(newPost as WithId<PostType>)
    },

    async createPostForBlogId(blogId: string, body: PostBodyWithoutBlogIdType): Promise<PostModelOutType> {
        const newPost: PostType = {
            createdAt: dateNow().toISOString(),
            blogName: 'name',
            blogId: blogId,
            ...body
        }
        await dbPostsCollection.insertOne(newPost)
        return postsService.postDbInToBlog(newPost as WithId<PostType>)
    },

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentType> {

        const comment: CommentDBType = {
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin
            },
            createdAt:dateNow().toISOString(),
            postId: postId
        }

        await dbCommentsCollection.insertOne(comment)

        return commentService.createCommentViewModel(comment as WithId<CommentDBType>)
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
