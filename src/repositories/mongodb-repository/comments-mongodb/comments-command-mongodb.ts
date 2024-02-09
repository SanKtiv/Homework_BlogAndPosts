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

    async updateCommentById(id: string, propertyUpdate: string): Promise<void> {
        await dbCommentsCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {content: propertyUpdate}})
    },

    async deleteCommentById(id: string): Promise<void> {
       await dbCommentsCollection.deleteOne({_id: new ObjectId(id)})
    },

    async deleteAll(): Promise<void> {
        await dbCommentsCollection.deleteMany({})
    }
}
