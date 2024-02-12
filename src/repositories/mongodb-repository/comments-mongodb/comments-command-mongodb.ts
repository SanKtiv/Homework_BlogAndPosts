import {CommentDBType, LikesInfoType} from "../../../types/comments-types";
import {dbCommentsCollection} from "../db";
import {ObjectId} from "mongodb";

export const commentsRepository = {

    async findCommentById(id: string): Promise<CommentDBType | null> {

        try {
            return dbCommentsCollection.findOne({_id: new ObjectId(id)})
        }
        catch (error) {
            return null
        }
    },

    async findComment(id: string): Promise<CommentDBType | null> {

        try {
            return dbCommentsCollection
                .findOne({_id: new ObjectId(id)}, {projection: {usersLikeStatuses: 0}})
        }
        catch (error) {
            return null
        }
    },

    async findCommentWithUserLikeStatus(commentId: string, userId: string): Promise<CommentDBType | null> {

        try {
            return dbCommentsCollection
                .findOne({_id: new ObjectId(commentId), 'usersLikeStatuses.userId': userId})
        }
        catch (error) {
            return null
        }
    },

    async updateCommentContentById(id: string, content: string): Promise<void> {
        await dbCommentsCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {content: content}})
    },

    async updateCommentAddNewUserLikeStatus(commentId: string, userId: string, status: string, likesInfo: LikesInfoType): Promise<void> {
        await dbCommentsCollection.updateOne({_id: new ObjectId(commentId)},
            {
                $set: {
                    'likesInfo.likesCount': likesInfo.likesCount,
                    'likesInfo.dislikesCount': likesInfo.dislikesCount,
                    'usersLikeStatuses.userId': userId,
                    'usersLikeStatuses.userStatus': status
                }
            })
    },

    async updateCommentLikesInfoByCommentId(commentId: string, userId: string, status: string, likesInfo: LikesInfoType): Promise<void> {
        await dbCommentsCollection
            .findOneAndUpdate({
                    _id: new ObjectId(commentId), 'likesInfo.usersStatuses.userId': userId
                },
                {
                    $set: {
                        'likesInfo.likesCount': likesInfo.likesCount,
                        'likesInfo.dislikesCount': likesInfo.dislikesCount,
                        'likesInfo.usersStatuses.userStatus': status
                    }
                })
    },

    async deleteCommentById(id: string): Promise<void> {
       await dbCommentsCollection.deleteOne({_id: new ObjectId(id)})
    },

    async deleteAll(): Promise<void> {
        await dbCommentsCollection.deleteMany({})
    }
}
