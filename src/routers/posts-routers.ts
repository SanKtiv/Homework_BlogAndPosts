import {Request, Response, Router} from 'express';
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb";
import {validId} from "../validations/blogs-validators";
import {validPostBlogId} from "../validations/posts-validators";
import {basicAuth, checkPostByPostId} from "../validations/middlewares";
import {checkInputFormComment} from "../validations/comments-validators";
import {authorizationJWT} from "../middlewares/authorization-jwt";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";

export const postRouter = Router ({})

postRouter.post('/posts',
    validPostBlogId,
    basicAuth,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const post = await postsRepository.createPost(req.body)
        return res.status(201).send(post)
})

postRouter.post('/posts/:postId/comments',
    authorizationJWT,
    checkInputFormComment,
    checkPostByPostId,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const comment = await postsRepository
            .createComment(req.params.postId, req.body.content, req.user!._id, req.user!.login)

        res.status(201).send(comment)
})

postRouter.put('/posts/:id',
    validPostBlogId,
    basicAuth,
    validId,
    errorsOfValidate,
    async (req: Request, res: Response) => {

        const postIsUpdate = await postsRepository.updatePost(req.params.id, req.body)
        if (postIsUpdate) return res.sendStatus(204)
        return res.sendStatus(404)
})

postRouter.delete('/posts/:id',
    basicAuth,
    validId,
    async (req: Request, res: Response) => {

        const postIsDelete = await postsRepository.deletePostById(req.params.id)
        if (postIsDelete) return res.sendStatus(204)
        return res.sendStatus(404)
})