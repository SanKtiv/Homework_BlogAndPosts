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
}
