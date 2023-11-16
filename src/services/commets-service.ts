import {WithId} from "mongodb";
import {CommentDBType, CommentType} from "../types/types-comments";

export const commentService = {

    createCommentViewModel(dbComment: WithId<CommentDBType>): CommentType {

        return {
            id: dbComment._id.toString(),
            content: dbComment.content,
            commentatorInfo: {
                userId: dbComment.commentatorInfo.userId,
                userLogin: dbComment.commentatorInfo.userLogin
            },
            createdAt: dbComment.createdAt
        }
    }
}