import {Request, Response, Router} from 'express';
import {postsRepository} from "../../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {validId} from "../../validations/blogs-validators";
import {validPostBlogId} from "../../validations/posts-validators";
import {checkPostByPostId} from "../../middlewares/posts-middlewares";
import {checkInputFormComment} from "../../validations/comments-validators";
import {authAccessToken} from "../../middlewares/authorization-jwt";
import {errorsOfValidate} from "../../middlewares/error-validators-middleware";
import {basicAuth} from "../../middlewares/authorization-basic";

export const postRouter = Router ({})

postRouter.post('/',
    validPostBlogId,
    basicAuth,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const post = await postsRepository.createPost(req.body)
        return res.status(201).send(post)
})

postRouter.post('/:postId/comments',
    authAccessToken,
    checkInputFormComment,
    checkPostByPostId,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const comment = await postsRepository
            .createComment(req.params.postId, req.body.content, req.user!.userId, req.user!.login)

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

postRouter.delete('/:id',
    basicAuth,
    validId,
    async (req: Request, res: Response) => {

        const postIsDelete = await postsRepository.deletePostById(req.params.id)
        if (postIsDelete) return res.sendStatus(204)
        return res.sendStatus(404)
})