import {CommentDBType, CommentType, ViewCommentModelType, ViewCommentPagingType} from "../../types/comments-types";
import {commentsRepositoryQuery} from "../../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {WithId} from "mongodb";

export const commentHandlers = {

    createCommentViewModel(dbComment: WithId<CommentType>, userId: string): ViewCommentModelType {

        const index = dbComment.usersLikeStatuses
            .findIndex(el => el.userId === userId)

        let myStatus = 'None'

        if (index !== -1) myStatus = dbComment.usersLikeStatuses[index].userStatus!

        return {
            id: dbComment._id.toString(),
            content: dbComment.content,
            commentatorInfo: {
                userId: dbComment.commentatorInfo.userId,
                userLogin: dbComment.commentatorInfo.userLogin
            },
            createdAt: dbComment.createdAt,
            likesInfo: {
                ...dbComment.likesInfo,
                myStatus: myStatus
            }
        }
    },

    async paginatorCommentViewModel(postId: string, query: any, userId: string, totalComments: number, commentsPaging: CommentDBType[]): Promise<ViewCommentPagingType> {

        // const totalCommentsByPostId = await commentsRepositoryQuery
        //     .getTotalCommentsByPostId(postId)
        //
        // const commentsPagingByPostId = await commentsRepositoryQuery
        //     .getCommentsByPostId(postId, query)

        return {
            pagesCount: Math.ceil(totalComments / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalComments,
            items: commentsPaging.map(el => this.createCommentViewModel(el, userId))
        }
    }
}