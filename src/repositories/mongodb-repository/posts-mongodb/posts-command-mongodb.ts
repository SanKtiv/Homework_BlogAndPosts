import {
    PostType,
    InputPostModelType,
    ViewPostModelType,
    PostBodyWithoutBlogIdType,
    PostDBType, ExtendedLikesInfoType, UserLikesInfoType
} from "../../../types/posts-types";
import {dbPostsCollection} from "../db";
import {dateNow} from "../../../variables/variables";
import {ObjectId} from "mongodb";
import {postsService} from "../../../services/posts-service";
import {blogsRepository} from "../blogs-mongodb/blogs-command-mongodb";

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
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0
            },
            userLikesInfo: [{
                userStatus: 'None',
                addedAt: 'None',
                userId: 'None',
                login: 'None',
            }],
            ...body
        }

        await dbPostsCollection.insertOne(newPost)

        return postsService.postDbInToBlog(newPost as PostDBType)
    },

    async createPostForBlogId(blogId: string, body: PostBodyWithoutBlogIdType): Promise<ViewPostModelType> {

        const blog = await blogsRepository.getBlogById(blogId)

        const newPost: PostType = {
            createdAt: dateNow().toISOString(),
            blogName: blog!.name,
            blogId: blogId,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0
            },
            userLikesInfo: [],
            ...body
        }

        await dbPostsCollection.insertOne(newPost)

        return postsService.postDbInToBlog(newPost as PostDBType)
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

    async updatePostAddLikesInfo(id: string,
                                 likesInfo: ExtendedLikesInfoType,
                                 userLikesInfo: UserLikesInfoType): Promise<Boolean> {

        const updateResult = await dbPostsCollection
            .updateOne({_id: new ObjectId(id)},
                {
                    $set: {extendedLikesInfo: likesInfo},
                    $push: {userLikesInfo: userLikesInfo}
                })

        return updateResult.matchedCount === 1
    },

    async updatePostChangeLikesInfo(id: string,
                                    userId: string,
                                    likesInfo: ExtendedLikesInfoType,
                                    userLikesInfo: UserLikesInfoType): Promise<Boolean> {

        const updateResult = await dbPostsCollection
            .updateOne({_id: new ObjectId(id), 'userLikesInfo.userId': userId},
                {
                    $set: {
                        extendedLikesInfo: likesInfo,
                        'userLikesInfo.$': userLikesInfo
                    }
                })

        return updateResult.matchedCount === 1
    },

    async deletePostById(id: string): Promise<Boolean> {

        const deletePost = await dbPostsCollection.deleteOne({_id: new ObjectId(id)})

        return deletePost.deletedCount === 1
    },

    async deleteAll(): Promise<void> {

        await dbPostsCollection.deleteMany({})
    }
}
