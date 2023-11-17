import {CommentDBType} from "../../types/types-comments";
import {dbCommentsCollection} from "./db";
import {ObjectId, WithId} from "mongodb";

export const commentsRepository = {

    async findCommentById(id: string): Promise<WithId<CommentDBType> | null> {

        try {
            return dbCommentsCollection.findOne({_id: new ObjectId(id)})
        }
        catch (error) {
            return null
        }
    },

    async updateCommentById(id: string, content: string): Promise<void> {
        await dbCommentsCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {content: content}})
    },

    async deleteCommentById(id: string): Promise<void> {
       await dbCommentsCollection.deleteOne({_id: new ObjectId(id)})
    },

    async deleteAll(): Promise<void> {
        await dbCommentsCollection.deleteMany({})
    }
}
