import {CommentDBType} from "../../../types/comments-types";
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

    async updateCommentContentById(id: string, content: string): Promise<void> {
        await dbCommentsCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {content: content}})
    },

    async updateCommentLikesInfoByCommentId(commentId: string, userId: string, status: string): Promise<void> {
        await dbCommentsCollection.findOneAndUpdate({_id: new ObjectId(commentId)}, {$set: {content: status}})
    },

    async deleteCommentById(id: string): Promise<void> {
       await dbCommentsCollection.deleteOne({_id: new ObjectId(id)})
    },

    async deleteAll(): Promise<void> {
        await dbCommentsCollection.deleteMany({})
    }
}
