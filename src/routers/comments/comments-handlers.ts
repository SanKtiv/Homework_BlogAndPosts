import {CommentDBType, ViewCommentModelType, ViewCommentPagingType} from "../../types/comments-types";

export class CommentsHandler {

    createCommentViewModel(commentDB: CommentDBType, userId?: string): ViewCommentModelType {

        let userStatus = 'None'

        if (userId) {

            const index = commentDB.usersLikeStatuses.findIndex(el => el.userId === userId)

            if (index !== -1) userStatus = commentDB.usersLikeStatuses[index].userStatus!
        }

        const newLikesInfo = {
            likesCount: commentDB.likesInfo.likesCount,
            dislikesCount: commentDB.likesInfo.dislikesCount,
            myStatus: userStatus
        }

        return {
            id: commentDB._id.toString(),
            content: commentDB.content,
            commentatorInfo: commentDB.commentatorInfo,
            createdAt: commentDB.createdAt,
            likesInfo: newLikesInfo
        }
    }

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

// export const commentsHandler = new CommentsHandler()