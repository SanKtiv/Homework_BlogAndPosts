import {CommentDBType, CommentType, LikesInfoType} from "../../../types/comments-types";
import {CommentModel, dbCommentsCollection} from "../db";
import {ObjectId} from "mongodb";

export const commentsRepository = {

    async insertComment(comment: CommentType): Promise<CommentDBType> {

        await CommentModel.insertMany([comment])
console.log(comment)
        return comment as CommentDBType
    },

    async updateCommentContentById(id: string, content: string): Promise<void> {
        await CommentModel.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {content: content}})
    },

    async updateCommentAddNewUserLikeStatus(commentId: string, userId: string, status: string, likesInfo: LikesInfoType): Promise<void> {

        await CommentModel.updateOne({_id: new ObjectId(commentId)},
            {
                $set: {
                    'likesInfo.likesCount': likesInfo.likesCount,
                    'likesInfo.dislikesCount': likesInfo.dislikesCount,
                },
                $push: {usersLikeStatuses: {userId: userId, userStatus: status}}
            })
    },

    async updateCommentLikesInfoByCommentId(commentId: string, userId: string, status: string, likesInfo: LikesInfoType): Promise<void> {

        await CommentModel
            .findOneAndUpdate({_id: new ObjectId(commentId), 'usersLikeStatuses.userId': userId},
                {
                    $set: {
                        'likesInfo.likesCount': likesInfo.likesCount,
                        'likesInfo.dislikesCount': likesInfo.dislikesCount,
                        'usersLikeStatuses.$.userStatus': status
                    }
                })
    },

    async deleteCommentById(id: string): Promise<void> {
        await CommentModel.deleteOne({_id: new ObjectId(id)})
    },

    async deleteAll(): Promise<void> {

        await dbCommentsCollection.deleteMany({})
    }
}

// export const commentsRepository = {
//
//     async insertComment(comment: CommentType): Promise<CommentDBType> {
//
//         await dbCommentsCollection.insertOne(comment)
//
//         return comment as CommentDBType
//     },
//
//     async updateCommentContentById(id: string, content: string): Promise<void> {
//         await dbCommentsCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {content: content}})
//     },
//
//     async updateCommentAddNewUserLikeStatus(commentId: string, userId: string, status: string, likesInfo: LikesInfoType): Promise<void> {
//
//         await dbCommentsCollection.updateOne({_id: new ObjectId(commentId)},
//             {
//                 $set: {
//                     'likesInfo.likesCount': likesInfo.likesCount,
//                     'likesInfo.dislikesCount': likesInfo.dislikesCount,
//                 },
//                 $push: {usersLikeStatuses: {userId: userId, userStatus: status}}
//             })
//     },
//
//     async updateCommentLikesInfoByCommentId(commentId: string, userId: string, status: string, likesInfo: LikesInfoType): Promise<void> {
//
//         await dbCommentsCollection
//             .findOneAndUpdate({_id: new ObjectId(commentId), 'usersLikeStatuses.userId': userId},
//                 {
//                     $set: {
//                         'likesInfo.likesCount': likesInfo.likesCount,
//                         'likesInfo.dislikesCount': likesInfo.dislikesCount,
//                         'usersLikeStatuses.$.userStatus': status
//                     }
//                 })
//     },
//
//     async deleteCommentById(id: string): Promise<void> {
//        await dbCommentsCollection.deleteOne({_id: new ObjectId(id)})
//     },
//
//     async deleteAll(): Promise<void> {
//         await dbCommentsCollection.deleteMany({})
//     }
// }
