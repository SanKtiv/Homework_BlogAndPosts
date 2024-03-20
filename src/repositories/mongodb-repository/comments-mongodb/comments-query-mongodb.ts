import {CommentModel} from "../db";
import {CommentDBType} from "../../../types/comments-types";
import {ObjectId} from "mongodb";

export const commentsRepositoryQuery = {

    async getCommentById(id: string): Promise<CommentDBType | null> {

        try {
            return CommentModel.findOne({_id: new ObjectId(id)})
        } catch (error) {
            return null
        }
    },

    async getTotalCommentsByPostId(postId: string): Promise<number> {
        return CommentModel.countDocuments({postId: postId})
    },

    async getCommentsByPostId(postId: string, query: any) {

        return CommentModel
            .find({postId: postId})
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
    }
}