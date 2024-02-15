import {WithId} from "mongodb";
import {
    CommentDBType,
    CommentType,
    LikesInfoType,
    UserStatusType,
    ViewCommentModelType,
    ViewCommentPagingType
} from "../types/comments-types";
import {jwtService} from "../applications/jwt-service";
import {commentsRepository} from "../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {postsRepositoryQuery} from "../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";
import {commentsRepositoryQuery} from "../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {dateNow} from "../variables/variables";
import {dbCommentsCollection} from "../repositories/mongodb-repository/db";

export const commentService = {

    async createCommentForPost(postId: string, content: string, userId: string, userLogin: string) {

        const comment: CommentType = {
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin
            },
            createdAt:dateNow().toISOString(),
            postId: postId,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            usersLikeStatuses: []
        }

        await dbCommentsCollection.insertOne(comment)

        return this.createCommentViewModel(comment as CommentDBType, userId)
    },

    async createLikesInfo(commentId: string, likeStatus: string, headersAuthorization: string) {

        const payload = await jwtService.getPayloadAccessToken(headersAuthorization)
        const userId: string = payload!.userId

        const commentWithUserLikeStatus = await commentsRepository
            .findCommentWithUserLikeStatus(commentId, userId)

        if (!commentWithUserLikeStatus) {

            const comment = await commentsRepository.findCommentWithOutUsersLikeStatuses(commentId)

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

    async paginatorCommentViewModel(postId: string, query: any, userId: string): Promise<ViewCommentPagingType> {

        const totalCommentsByPostId = await commentsRepositoryQuery
            .getTotalCommentsByPostId(postId)

        const commentsPagingByPostId = await commentsRepositoryQuery
            .getCommentsByPostId(postId, query)

        return {
            pagesCount: Math.ceil(totalCommentsByPostId / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalCommentsByPostId,
            items: commentsPagingByPostId.map(el => this.createCommentViewModel(el, userId))
        }
    }
}