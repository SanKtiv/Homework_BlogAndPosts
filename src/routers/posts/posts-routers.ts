import {Request, Response, Router} from 'express';
import {postsRepository} from "../../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {validId} from "../../validations/blogs-validators";
import {validPostBlogId} from "../../validations/posts-validators";
import {checkPostByPostId} from "../../middlewares/posts-middlewares";
import {checkInputFormComment} from "../../validations/comments-validators";
import {authAccessToken} from "../../middlewares/authorization-jwt";
import {errorsOfValidate} from "../../middlewares/error-validators-middleware";
import {basicAuth} from "../../middlewares/authorization-basic";
import {commentService} from "../../services/comments-service";
import {postsRepositoryQuery} from "../../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";
import {postsService} from "../../services/posts-service";
import {likeStatusBody} from "../../validations/like-status-validation";
import {blogsRepository} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";
import {blogsRepositoryQuery} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";

export const postRouter = Router ({})

postRouter.post('/',
    validPostBlogId,
    basicAuth,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const blog = await blogsRepositoryQuery.getBlogById(req.body.blogId)

        const post = await postsService.createPost(req.body, blog!.name)

        return res.status(201).send(post)
    })

postRouter.post('/:postId/comments',
    authAccessToken,
    checkInputFormComment,
    checkPostByPostId,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const postId = req.params.postId
        const content = req.body.content
        const userId = req.user!.userId
        const userLogin = req.user!.login

        const comment = await commentService
            .createCommentForPost(postId, content, userId, userLogin)

        res.status(201).send(comment)
    })

postRouter.put('/:id',
    validPostBlogId,
    basicAuth,
    validId,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const postIsUpdate = await postsRepository.updatePost(req.params.id, req.body)

        if (postIsUpdate) return res.sendStatus(204)

        return res.sendStatus(404)
})

postRouter.put('/:postId/like-status', authAccessToken, likeStatusBody, errorsOfValidate, async (req: Request, res: Response) => {

    const dataBody = {
        id: req.params.postId,
        likeStatus: req.body.likeStatus,
        userId: req.user!.userId,
        login: req.user!.login,
    }

    const likesInfo = await postsRepositoryQuery.getLikesInfoByPostId(dataBody.id)

    if (!likesInfo) return res.sendStatus(404)

    const userLikeStatus = await postsRepositoryQuery
        .getPostUserLikeStatusByPostId(dataBody.id, dataBody.userId)

    if (!userLikeStatus) {
        await postsService
            .addLikesInfoInPost(dataBody, likesInfo.extendedLikesInfo)

        return res.sendStatus(204)
    }

    const userStatus = userLikeStatus.userLikesInfo[0].userStatus

    if (userStatus === dataBody.likeStatus) return res.sendStatus(204)

    await postsService
        .changeLikesInfoInPost(dataBody, likesInfo.extendedLikesInfo, userStatus)

    return res.sendStatus(204)
})

postRouter.delete('/:id',
    basicAuth,
    validId,
    async (req: Request, res: Response) => {

        const postIsDelete = await postsRepository.deletePostById(req.params.id)

        if (postIsDelete) return res.sendStatus(204)

        return res.sendStatus(404)
})