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
        const comment = await commentsRepository.findCommentById(commentId)
        let likesCount = comment!.likesInfo.likesCount
        let dislikesCount = comment!.likesInfo.dislikesCount
        const usersStatuses: UserStatusType = {
            userId,
            userStatus: likeStatus
        }

        if (likeStatus === 'Like') likesCount++
        if (likeStatus === 'Dislike') dislikesCount++

        const likesInfo: LikesInfoType = {
            likesCount,
            dislikesCount,
        }

        await commentsRepository.updateCommentLikesInfoByCommentId()
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