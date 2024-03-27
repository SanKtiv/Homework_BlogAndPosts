import {Router} from "express";
import {commentsValidation} from "../../validations/comments-validators";
import {authMiddleware} from "../../middlewares/auth-middleware";
import {errorMiddleware} from "../../middlewares/errors-middleware";
import {likeStatusValidation} from "../../validations/like-status-validation";
import {commentsController, commentsMiddleware} from "../../composition-root";

export const commentRouter = Router({})

commentRouter.get('/:id',
    commentsValidation.id.bind(commentsValidation),
    commentsController.getCommentById.bind(commentsController))

commentRouter.put('/:commentId',
    authMiddleware.accessToken.bind(authMiddleware),
    commentsValidation.commentId.bind(commentsValidation),
    errorMiddleware.error.bind(errorMiddleware),
    commentsMiddleware.commentOwner.bind(commentsMiddleware),
    commentsController.updateCommentById.bind(commentsController))

commentRouter.put('/:commentId/like-status',
    authMiddleware.accessToken.bind(authMiddleware),
    commentsMiddleware.commentId.bind(commentsMiddleware),
    likeStatusValidation.likeStatus.bind(likeStatusValidation),
    errorMiddleware.error.bind(errorMiddleware),
    commentsController.updateCommentLikeStatusById.bind(commentsController))

commentRouter.delete('/:commentId',
    authMiddleware.accessToken.bind(authMiddleware),
    commentsMiddleware.commentOwner.bind(commentsMiddleware),
    commentsController.deleteCommentById.bind(commentsController))