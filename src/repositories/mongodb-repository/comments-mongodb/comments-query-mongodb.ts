import {dbCommentsCollection} from "../db";
import {CommentDBType} from "../../../types/comments-types";
import {ObjectId} from "mongodb";

export const commentsRepositoryQuery = {

    async getCommentById(id: string): Promise<CommentDBType | null> {

        try {
            return dbCommentsCollection.findOne({_id: new ObjectId(id)})
        } catch (error) {
            return null
        }
    },

    async findCommentWithoutUsersLikeStatuses(id: string): Promise<CommentDBType | null> {

        try {
            return dbCommentsCollection
                .findOne({_id: new ObjectId(id)}, {projection: {usersLikeStatuses: 0}})
        } catch (error) {
            return null
        }
    },

    async findCommentWithUserLikeStatus(commentId: string, userId: string): Promise<CommentDBType | null> {

        try {
            return dbCommentsCollection
                .findOne({_id: new ObjectId(commentId), 'usersLikeStatuses.userId': userId},
                    {
                        projection: {
                            content: 1,
                            commentatorInfo: 1,
                            createdAt: 1,
                            postId: 1,
                            likesInfo: 1,
                            'usersLikeStatuses.$': 1
                        }
                    })
        } catch (error) {
            console.log('UserId is not found')
            return null
        }
    },

    async getTotalCommentsByPostId(postId: string): Promise<number> {
        return dbCommentsCollection.countDocuments({postId: postId})
    },

    async getCommentsByPostId(postId: string, query: any) {

        return dbCommentsCollection
            .find({postId: postId})
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()
    }
}