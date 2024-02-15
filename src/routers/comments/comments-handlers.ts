import {CommentDBType, CommentType, ViewCommentModelType, ViewCommentPagingType} from "../../types/comments-types";
import {commentsRepositoryQuery} from "../../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {WithId} from "mongodb";

export const commentHandlers = {

    createCommentViewModel(dbComment: CommentDBType, userId?: string): ViewCommentModelType {

        let userStatus = 'None'

        if (userId) {
            const index = dbComment.usersLikeStatuses.findIndex(el => el.userId === userId)
            if (index !== -1) userStatus = dbComment.usersLikeStatuses[index].userStatus!
        }

        const {_id, usersLikeStatuses, postId, ...viewModel} = dbComment

        const newLikesInfo = {...dbComment.likesInfo, myStatus: userStatus}

        return {
            id: dbComment._id.toString(),
            ...viewModel,
            likesInfo: newLikesInfo
        }

        // return {
        //     id: dbComment._id.toString(),
        //     content: dbComment.content,
        //     commentatorInfo: {
        //         userId: dbComment.commentatorInfo.userId,
        //         userLogin: dbComment.commentatorInfo.userLogin
        //     },
        //     createdAt: dbComment.createdAt,
        //     likesInfo: {
        //         ...dbComment.likesInfo,
        //         myStatus: myStatus
        //     }
        // }
    },

    async paginatorCommentViewModel(postId: string,
                                    query: any,
                                    totalComments: number,
                                    commentsPaging: CommentDBType[],
                                    userId?: string,): Promise<ViewCommentPagingType> {

        return {
            pagesCount: Math.ceil(totalComments / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalComments,
            items: commentsPaging.map(el => this.createCommentViewModel(el, userId))
        }
    }
}