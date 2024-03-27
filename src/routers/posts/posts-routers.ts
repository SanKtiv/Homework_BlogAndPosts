import {Router} from 'express';
import {blogsValidation} from "../../validations/blogs-validators";
import {postsValidation} from "../../validations/posts-validators";
import {authMiddleware} from "../../middlewares/auth-middleware";
import {errorMiddleware} from "../../middlewares/errors-middleware";
import {likeStatusValidation} from "../../validations/like-status-validation";
import {commentsValidation} from "../../validations/comments-validators";
import {blogsMiddleware, postsController, postsMiddleware} from "../../composition-root";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";

export const postRouter = Router({})

postRouter.post('/',
    postsValidation.blogId.bind(postsValidation),
    postsValidation.title.bind(postsValidation),
    postsValidation.content.bind(postsValidation),
    postsValidation.shortDescription.bind(postsValidation),
    authMiddleware.basic.bind(authMiddleware),
    errorMiddleware.error.bind(errorMiddleware),
    postsController.createPost.bind(postsController))

postRouter.post('/:postId/comments',
    authMiddleware.accessToken.bind(authMiddleware),
    commentsValidation.postId.bind(commentsValidation),
    commentsValidation.content.bind(commentsValidation),
    postsMiddleware.postId.bind(postsMiddleware),
    errorMiddleware.error.bind(errorMiddleware),
    postsController.createCommentForPost.bind(postsController))

postRouter.get('/',
    blogsMiddleware.setDefaultPaging.bind(blogsMiddleware),
    postsController.getPostsPaging.bind(postsController))

postRouter.get('/:id',
    postsController.getPostById.bind(postsController))

postRouter.get('/:postId/comments',
    postsMiddleware.postId.bind(postsMiddleware),
    usersPaginatorDefault,
    postsController.getCommentsByPostId.bind(postsController))

postRouter.put('/:id',
    postsValidation.blogId.bind(postsValidation),
    postsValidation.title.bind(postsValidation),
    postsValidation.content.bind(postsValidation),
    postsValidation.shortDescription.bind(postsValidation),
    authMiddleware.basic.bind(authMiddleware),
    blogsValidation.id.bind(blogsValidation),
    errorMiddleware.error.bind(errorMiddleware),
    postsController.updatePost.bind(postsController))

postRouter.put('/:postId/like-status',
    authMiddleware.accessToken.bind(authMiddleware),
    likeStatusValidation.likeStatus.bind(likeStatusValidation),
    errorMiddleware.error.bind(errorMiddleware),
    postsController.createLikeStatusForPost.bind(postsController))

postRouter.delete('/:id',
    authMiddleware.basic.bind(authMiddleware),
    blogsValidation.id.bind(blogsValidation),
    postsController.deletePostById.bind(postsController))