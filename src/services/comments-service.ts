import {CommentDBType, CommentType,} from "../types/comments-types";
import {CommentsRepository} from "../repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";

export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository) {}

    async createCommentForPost(postId: string,
                               content: string,
                               userId: string,
                               userLogin: string): Promise<CommentDBType> {

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

        return this.commentsRepository.insertComment(comment)
    }

    async addOrChangeLikesInfo(commentDB: CommentDBType, userId: string, likeStatus: string) {

        const commentId = commentDB._id.toString()
        const {usersLikeStatuses, likesInfo} = commentDB

        const findUser = usersLikeStatuses.find(el => el.userId === userId)

        if (!findUser) {

            if (likeStatus === 'Like') likesInfo.likesCount++
            if (likeStatus === 'Dislike') likesInfo.dislikesCount++

            return this.commentsRepository
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

        return this.commentsRepository
            .updateCommentLikesInfoByCommentId(commentId, userId, likeStatus, likesInfo)
    }

    async updateCommentContentById(id: string, content: string): Promise<void> {

        await this.commentsRepository.updateCommentContentById(id, content)
    }

    async deleteCommentById(id: string) {

        await this.commentsRepository.deleteCommentById(id)
    }
}