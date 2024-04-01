import {CommentDBType, CommentType, LikesInfoType} from "../../../types/comments-types";
import {CommentsModel} from "../db";
import {ObjectId} from "mongodb";

export class CommentsRepository {

    async insertComment(comment: CommentType): Promise<CommentDBType> {

        const commentDB = await CommentsModel.create(comment)

        return commentDB as CommentDBType
    }

    async updateCommentContentById(id: string, content: string): Promise<void> {

        await CommentsModel.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {content: content}})
    }

    async updateCommentAddNewUserLikeStatus(commentId: string,
                                            userId: string,
                                            status: string,
                                            likesInfo: LikesInfoType): Promise<void> {

        await CommentsModel.updateOne({_id: new ObjectId(commentId)},
            {
                $set: {
                    'likesInfo.likesCount': likesInfo.likesCount,
                    'likesInfo.dislikesCount': likesInfo.dislikesCount,
                },
                $push: {usersLikeStatuses: {userId: userId, userStatus: status}}
            })
    }

    async updateCommentLikesInfoByCommentId(commentId: string,
                                            userId: string,
                                            status: string,
                                            likesInfo: LikesInfoType): Promise<void> {

        await CommentsModel
            .findOneAndUpdate({_id: new ObjectId(commentId), 'usersLikeStatuses.userId': userId},
                {
                    $set: {
                        'likesInfo.likesCount': likesInfo.likesCount,
                        'likesInfo.dislikesCount': likesInfo.dislikesCount,
                        'usersLikeStatuses.$.userStatus': status
                    }
                })
    }

    async deleteCommentById(id: string): Promise<void> {

        await CommentsModel.deleteOne({_id: new ObjectId(id)})
    }

    async deleteAll(): Promise<void> {

        await CommentsModel.deleteMany({})
    }
}
