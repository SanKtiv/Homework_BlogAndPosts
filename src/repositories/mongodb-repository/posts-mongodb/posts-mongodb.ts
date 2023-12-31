import {
    PostType,
    InputPostModelType,
    ViewPostModelType,
    PostBodyWithoutBlogIdType,
    PostDBType
} from "../../../types/posts-types";
import {dbPostsCollection, dbCommentsCollection} from "../db";
import {dateNow} from "../../../variables/variables";
import {ObjectId} from "mongodb";
import {postsService} from "../../../services/posts-service";
import {CommentDBType, CommentType, ViewCommentModelType} from "../../../types/comments-types";
import {commentService} from "../../../services/commets-service";
import {blogsRepository} from "../blogs-mongodb/blogs-mongodb";

export const postsRepository = {

    async getAllPosts(): Promise<ViewPostModelType[]> {
        const allPosts = await dbPostsCollection.find().toArray()
        return allPosts.map(postOutDb => postsService.postDbInToBlog(postOutDb))
    },

    async getPostById(id: string): Promise<ViewPostModelType | null> {
        const postOutDb = await dbPostsCollection.findOne({_id: new ObjectId(id)})
        if (postOutDb === null) return null
        return postsService.postDbInToBlog(postOutDb)
    },

    async createPost(body: InputPostModelType): Promise<ViewPostModelType> {
        const blog = await blogsRepository.getBlogById(body.blogId)
        const newPost: PostType = {
            createdAt: dateNow().toISOString(),
            blogName: blog!.name,
            ...body
        }
        await dbPostsCollection.insertOne(newPost)
        return postsService.postDbInToBlog(newPost as PostDBType)
    },

    async createPostForBlogId(blogId: string, body: PostBodyWithoutBlogIdType): Promise<ViewPostModelType> {
        const newPost: PostType = {
            createdAt: dateNow().toISOString(),
            blogName: 'name',
            blogId: blogId,
            ...body
        }
        await dbPostsCollection.insertOne(newPost)
        return postsService.postDbInToBlog(newPost as PostDBType)
    },

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<ViewCommentModelType> {

        const comment: CommentType = {
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin
            },
            createdAt:dateNow().toISOString(),
            postId: postId
        }

        await dbCommentsCollection.insertOne(comment)

        return commentService.createCommentViewModel(comment as CommentDBType)
    },

    async updatePost(id: string, body: InputPostModelType): Promise<Boolean> {
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
