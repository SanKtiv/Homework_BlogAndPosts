import {Request, Response, Router} from 'express';
import {postsRepositoryQuery} from "../../repositories/mongodb-repository/posts-mongodb/posts-mongodb-Query";
import {postsRepository} from "../../repositories/mongodb-repository/posts-mongodb/posts-mongodb";
import {blogsPaginatorDefault} from "../../middlewares/blogs-middlewares";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";
import {checkPostByPostId} from "../../middlewares/posts-middlewares";

export const postRouterQuery = Router ({})

postRouterQuery.get( '/', blogsPaginatorDefault, async (req: Request, res: Response) => {
    return res.status(200).send(await postsRepositoryQuery.getPostsWithPaging(req.query))
})

postRouterQuery.get( '/:id', async (req: Request, res: Response) => {
    const posts = await postsRepository.getPostById(req.params.id)
    if (posts) return res.status(200).send(posts)
    return res.sendStatus(404)
})

postRouterQuery.get('/:postId/comments', checkPostByPostId, usersPaginatorDefault, async (req: Request, res: Response) =>{
    const paginatorCommentViewModel = await postsRepositoryQuery
        .getCommentsByPostId(req.params.postId, req.query)
    res.status(200).send(paginatorCommentViewModel)
})