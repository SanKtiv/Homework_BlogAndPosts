import {WithId} from "mongodb";
import {CommentDBType, CommentType, PaginatorCommentViewModelType} from "../types/types-comments";

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
    },

    paginatorCommentViewModel(
        totalComments: number,
        findComments: WithId<CommentDBType>[],
        query: any): PaginatorCommentViewModelType {

        return {
            pagesCount: Math.ceil(totalComments / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalComments,
            items: findComments.map(el => this.createCommentViewModel(el))
        }
    }
}