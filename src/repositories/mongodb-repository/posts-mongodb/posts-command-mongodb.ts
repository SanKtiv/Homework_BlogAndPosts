import {
    PostType,
    InputPostModelType,
    PostDBType, ExtendedLikesInfoType, UserLikesInfoType
} from "../../../types/posts-types";
import {dbPostsCollection} from "../db";
import {ObjectId} from "mongodb";

class PostsRepository {

    async insertPostToDB(post: PostType): Promise<PostDBType> {

        await dbPostsCollection.insertOne(post)

        return post as PostDBType
    }

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
    }

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
    }

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
    }

    async updatePostRemoveUserLikeStatus(id: string,
                                         userId: string,
                                         likesInfo: ExtendedLikesInfoType): Promise<Boolean> {

        const updateResult = await dbPostsCollection
            .updateOne({_id: new ObjectId(id)},
                {
                    $set: {extendedLikesInfo: likesInfo},
                    $pull: {userLikesInfo: {userId: userId}}
                })

        return updateResult.matchedCount === 1
    }

    async deletePostById(id: string): Promise<Boolean> {

        const deletePost = await dbPostsCollection.deleteOne({_id: new ObjectId(id)})

        return deletePost.deletedCount === 1
    }

    async deleteAll(): Promise<void> {

        await dbPostsCollection.deleteMany({})
    }
}

export const postsRepository = new PostsRepository()
