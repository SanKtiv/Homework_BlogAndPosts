import {
    CommentDBType,
    CommentType,
    ViewCommentModelType,
} from "../types/comments-types";
import {commentsRepository} from "../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {commentHandler} from "../routers/comments/comments-handlers";

export const commentService = {

    async createCommentForPost(postId: string,
                               content: string,
                               userId: string,
                               userLogin: string): Promise<ViewCommentModelType> {

        const comment: CommentType = {
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin
            },
            createdAt: new Date().toISOString(),
            postId: postId,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            usersLikeStatuses: [{
                userId: userId,
                userStatus: 'None'
            }]
        }

        const commentDB = await commentsRepository.insertComment(comment)

        return commentHandler.createCommentViewModel(commentDB)
    },

    async addOrChangeLikesInfo(commentDB: CommentDBType, userId: string, likeStatus: string) {

        const commentId = commentDB._id.toString()
        const {usersLikeStatuses, likesInfo} = commentDB

        const findUser = usersLikeStatuses.find(el => el.userId === userId)

        if (!findUser) {

            if (likeStatus === 'Like') likesInfo.likesCount++
            if (likeStatus === 'Dislike') likesInfo.dislikesCount++

            return commentsRepository
                .updateCommentAddNewUserLikeStatus(commentId, userId, likeStatus, likesInfo)
        }

        const userStatus = findUser.userStatus

        if (likeStatus === 'Like' && userStatus === 'Dislike') {
            likesInfo.likesCount++
            likesInfo.dislikesCount--
        }

        if (likeStatus === 'Dislike' && userStatus === 'Like') {
            likesInfo.likesCount--
            likesInfo.dislikesCount++
        }

        if (likeStatus === 'Like' && userStatus === 'None') likesInfo.likesCount++

        if (likeStatus === 'Dislike' && userStatus === 'None') likesInfo.dislikesCount++

        if (likeStatus === 'None' && userStatus === 'Like') likesInfo.likesCount--

        if (likeStatus === 'None' && userStatus === 'Dislike') likesInfo.dislikesCount--

        return commentsRepository
            .updateCommentLikesInfoByCommentId(commentId, userId, likeStatus, likesInfo)
    },

    // async createCommentViewModel(dbComment: CommentDBType): Promise<ViewCommentModelType> {
    //
    //     const likesInfo = {
    //         likesCount: dbComment.likesInfo.likesCount,
    //         dislikesCount: dbComment.likesInfo.dislikesCount,
    //         myStatus: dbComment.usersLikeStatuses[0].userStatus
    //     }
    //
    //     return {
    //         id: dbComment._id.toString(),
    //         content: dbComment.content,
    //         commentatorInfo: dbComment.commentatorInfo,
    //         createdAt: dbComment.createdAt,
    //         likesInfo: likesInfo
    //     }
    // }
}