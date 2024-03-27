import {CommentsQueryRepository} from "../../repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {JwtService} from "../../applications/jwt-service";
import {CommentsHandler} from "./comments-handlers";
import {CommentsService} from "../../services/comments-service";
import {Request, Response} from "express";
import {constants} from "http2";

export class CommentsController {

    constructor(protected commentsQueryRepository: CommentsQueryRepository,
                protected jwtService: JwtService,
                protected commentsHandler: CommentsHandler,
                protected commentsService: CommentsService) {}

    async getCommentById(req: Request, res: Response) {

        const id = req.params.id

        const authorization = req.headers.authorization

        const commentDB = await this.commentsQueryRepository.getCommentById(id)

        if (!commentDB) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)

        if (authorization) {

            const payload = await this.jwtService.getPayloadAccessToken(authorization)

            if (payload) {

                const viewModel = this.commentsHandler.createCommentViewModel(commentDB, payload.userId)

                return res.status(constants.HTTP_STATUS_OK).send(viewModel)
            }
        }

        const commentViewModel = this.commentsHandler.createCommentViewModel(commentDB)

        return res.status(constants.HTTP_STATUS_OK).send(commentViewModel)
    }

    async updateCommentById(req: Request, res: Response) {

        const id = req.params.commentId
        const content = req.body.content

        await this.commentsService.updateCommentContentById(id, content)

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async updateCommentLikeStatusById(req: Request, res: Response) {

        const commentId = req.params.commentId
        const likeStatus = req.body.likeStatus
        const userId = req.user!.userId
        const commentDB = await this.commentsQueryRepository.getCommentById(commentId)

        await this.commentsService
            .addOrChangeLikesInfo(commentDB!, userId, likeStatus)

        return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async deleteCommentById(req: Request, res: Response) {

        await this.commentsService.deleteCommentById(req.params.commentId)

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }
}