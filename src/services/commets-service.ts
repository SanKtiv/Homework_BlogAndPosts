import {WithId} from "mongodb";
import {CommentType, ViewCommentModelType, ViewCommentPagingType} from "../types/comments-types";

export const commentService = {

    createCommentViewModel(dbComment: WithId<CommentType>): ViewCommentModelType {

        return {
            id: dbComment._id.toString(),
            content: dbComment.content,
            commentatorInfo: {
                userId: dbComment.commentatorInfo.userId,
                userLogin: dbComment.commentatorInfo.userLogin
            },
            createdAt: dbComment.createdAt
        }
    },

    paginatorCommentViewModel(
        totalComments: number,
        findComments: WithId<CommentType>[],
        query: any): ViewCommentPagingType {

        return {
            pagesCount: Math.ceil(totalComments / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalComments,
            items: findComments.map(el => this.createCommentViewModel(el))
        }
    }
}