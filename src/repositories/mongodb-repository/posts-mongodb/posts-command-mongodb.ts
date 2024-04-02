import {PostType, InputPostModelType, PostDBType, ExtendedLikesInfoType, UserLikesInfoType} from "../../../types/posts-types";
import {PostsModel} from "../db";
import {ObjectId} from "mongodb";

export class PostsRepository {

    async insertPostToDB(post: PostType): Promise<PostDBType> {

        const postDB = await PostsModel.create(post)

        return postDB as PostDBType
    }

    async updatePost(id: string, body: InputPostModelType): Promise<Boolean> {

        const resultUpdate = await PostsModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId
            }
        })

        return resultUpdate.modifiedCount === 1
    }

    async updatePostAddLikesInfo(id: string,
                                 likesInfo: ExtendedLikesInfoType,
                                 userLikesInfo: UserLikesInfoType): Promise<Boolean> {

        const resultUpdate = await PostsModel
            .updateOne({_id: new ObjectId(id)},
                {
                    $set: {extendedLikesInfo: likesInfo},
                    $push: {userLikesInfo: userLikesInfo}
                })

        return resultUpdate.modifiedCount === 1
    }

    async updatePostChangeLikesInfo(id: string,
                                    userId: string,
                                    likesInfo: ExtendedLikesInfoType,
                                    userLikesInfo: UserLikesInfoType): Promise<Boolean> {

        const resultUpdate = await PostsModel
            .updateOne({_id: new ObjectId(id), 'userLikesInfo.userId': userId},
                {
                    $set: {
                        extendedLikesInfo: likesInfo,
                        'userLikesInfo.$': userLikesInfo
                    }
                })

        return resultUpdate.modifiedCount === 1
    }

    async updatePostRemoveUserLikeStatus(id: string,
                                         userId: string,
                                         likesInfo: ExtendedLikesInfoType): Promise<Boolean> {

        const resultUpdate = await PostsModel
            .updateOne({_id: new ObjectId(id)},
                {
                    $set: {extendedLikesInfo: likesInfo},
                    $pull: {userLikesInfo: {userId: userId}}
                })

        return resultUpdate.modifiedCount === 1
    }

    async deletePostById(id: string): Promise<Boolean> {

        const resultDelete = await PostsModel.deleteOne({_id: new ObjectId(id)})

        return resultDelete.deletedCount === 1
    }

    async deleteAll(): Promise<void> {

        await PostsModel.deleteMany({})
    }
}
