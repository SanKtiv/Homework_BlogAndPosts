import {
    CommentDBType,
    CommentType,
    LikesInfoType,
    ViewCommentModelType,
} from "../types/comments-types";
import {jwtService} from "../applications/jwt-service";
import {commentsRepository} from "../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {commentsRepositoryQuery} from "../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {dateNow} from "../variables/variables";
import {dbCommentsCollection} from "../repositories/mongodb-repository/db";

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
            createdAt: dateNow().toISOString(),
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

        return this.createCommentViewModel(commentDB)
    },

    async createLikesInfo(commentId: string, likeStatus: string, headersAuthorization: string) {

        const payload = await jwtService.getPayloadAccessToken(headersAuthorization)
        const userId: string = payload!.userId

        const commentWithUserLikeStatus = await commentsRepositoryQuery
            .findCommentWithUserLikeStatus(commentId, userId)

        if (!commentWithUserLikeStatus) {

            const comment = await commentsRepositoryQuery
                .findCommentWithoutUsersLikeStatuses(commentId)

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
        }

        if (likeStatus === 'Like' && userStatus === 'None') likesCount++

        if (likeStatus === 'Dislike' && userStatus === 'Like') {
            likesCount--
            dislikesCount++
        }

        if (likeStatus === 'Dislike' && userStatus === 'None') dislikesCount++

        if (likeStatus === 'None' && userStatus === 'Like') likesCount--

        if (likeStatus === 'None' && userStatus === 'Dislike') dislikesCount--

        const likesInfo: LikesInfoType = {
            likesCount,
            dislikesCount,
        }

        return commentsRepository
            .updateCommentLikesInfoByCommentId(commentId, userId, likeStatus, likesInfo)
    },

    createCommentViewModel(dbComment: CommentDBType): ViewCommentModelType {

        const {_id, postId, usersLikeStatuses, ...viewComment} = dbComment

        const myStatus = usersLikeStatuses[0].userStatus

        const newLikesInfo = {
            ...dbComment.likesInfo,
            myStatus: myStatus
        }

        return {
            id: dbComment._id.toString(),
            ...viewComment,
            likesInfo: newLikesInfo
        }
    }
}