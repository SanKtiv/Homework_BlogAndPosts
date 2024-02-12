import {WithId} from "mongodb";
import {
    CommentType,
    LikesInfoType,
    UserStatusType,
    ViewCommentModelType,
    ViewCommentPagingType
} from "../types/comments-types";
import {jwtService} from "../applications/jwt-service";
import {commentsRepository} from "../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";

export const commentService = {

    async createLikesInfo(commentId: string, likeStatus: string, accessToken: string) {

        const token = accessToken.split(' ')[1]
        const payload = await jwtService.getPayloadAccessToken(token)
        const userId: string = payload!.userId

        const commentWithUserLikeStatus = await commentsRepository
            .findCommentWithUserLikeStatus(commentId, userId)

        if (!commentWithUserLikeStatus) {

            const comment = await commentsRepository.findComment(commentId)

            let likesCount = comment!.likesInfo.likesCount
            let dislikesCount = comment!.likesInfo.dislikesCount

            if (likeStatus === 'Like') likesCount++
            if (likeStatus === 'Dislike') dislikesCount++

            const likesInfo: LikesInfoType = {
                likesCount,
                dislikesCount,
            }

            return  commentsRepository
                .updateCommentAddNewUserLikeStatus(commentId, userId, likeStatus, likesInfo)
        }

        let likesCount = commentWithUserLikeStatus.likesInfo.likesCount
        let dislikesCount = commentWithUserLikeStatus.likesInfo.dislikesCount
        let userStatus = commentWithUserLikeStatus.usersLikeStatuses![0].userStatus


        if (likeStatus === 'Like' && userStatus === 'Dislike') {
            likesCount++
            dislikesCount--
            //userStatus = likeStatus
        }

        if (likeStatus === 'Like' && userStatus === 'None') {
            likesCount++
            //userStatus = likeStatus
        }

        if (likeStatus === 'Dislike' && userStatus === 'Like') {
            likesCount--
            dislikesCount++
            //userStatus = likeStatus
        }

        if (likeStatus === 'Dislike' && userStatus === 'None') {
            dislikesCount++
            //userStatus = likeStatus
        }

        //if (likeStatus === 'None') userStatus = likeStatus

        const likesInfo: LikesInfoType = {
            likesCount,
            dislikesCount,
        }

        return commentsRepository
            .updateCommentLikesInfoByCommentId(commentId, userId, likeStatus, likesInfo)
    },

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