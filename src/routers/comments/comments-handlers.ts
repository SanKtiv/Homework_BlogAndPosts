import {CommentDBType, ViewCommentModelType, ViewCommentPagingType} from "../../types/comments-types";

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