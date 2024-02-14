import {Request, Response, Router} from 'express';
import {postsRepositoryQuery} from "../../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";
import {postsRepository} from "../../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {blogsPaginatorDefault} from "../../middlewares/blogs-middlewares";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";
import {checkPostByPostId} from "../../middlewares/posts-middlewares";
import {postsService} from "../../services/posts-service";
import {commentService} from "../../services/commets-service";
import {jwtService} from "../../applications/jwt-service";

export const postRouterQuery = Router ({})

postRouterQuery.get( '/', blogsPaginatorDefault, async (req: Request, res: Response) => {
    return res.status(200).send(await postsRepositoryQuery.getPostsWithPaging(req.query))
})

postRouterQuery.get( '/:id', async (req: Request, res: Response) => {
    const posts = await postsRepository.getPostById(req.params.id)
    if (posts) return res.status(200).send(posts)
    return res.sendStatus(404)
})

postRouterQuery.get('/:postId/comments',
    checkPostByPostId,
    usersPaginatorDefault,
    async (req: Request, res: Response) => {

        const accessToken = jwtService.getAccessTokenFromHeaders(req.headers.authorization!)
        const payload = await jwtService.getPayloadAccessToken(accessToken)
        const paginatorCommentViewModel = await commentService
            .paginatorCommentViewModel(req.params.postId, req.query, payload!.userId)

        res.status(200).send(paginatorCommentViewModel)
    })