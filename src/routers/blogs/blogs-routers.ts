import {Router} from 'express';
import {blogsValidation} from "../../validations/blogs-validators";
import {postsValidation} from "../../validations/posts-validators";
import {blogsMiddleware} from "../../middlewares/blogs-middlewares";
import {errorMiddleware} from "../../middlewares/errors-middleware";
import {authorizationMiddleware} from "../../middlewares/authorization-jwt";
import {blogsController} from "../../composition-root";

export const blogsRouter = Router({})

blogsRouter.post('/',
    blogsValidation.name.bind(blogsValidation),
    blogsValidation.description.bind(blogsValidation),
    blogsValidation.websiteUrl.bind(blogsValidation),
    authorizationMiddleware.basic.bind(authorizationMiddleware),
    errorMiddleware.error.bind(errorMiddleware),
    blogsController.createBlog.bind(blogsController))

blogsRouter.post('/:blogId/posts',
    postsValidation.title.bind(postsValidation),
    postsValidation.shortDescription.bind(postsValidation),
    postsValidation.content.bind(postsValidation),
    authorizationMiddleware.basic.bind(authorizationMiddleware),
    blogsMiddleware.existBlog.bind(blogsMiddleware),
    errorMiddleware.error.bind(errorMiddleware),
    blogsController.createPostForBlog.bind(blogsController))

blogsRouter.get('/',
    blogsMiddleware.setDefaultPaging.bind(blogsMiddleware),
    blogsController.getBlogsWithPaging.bind(blogsController))

blogsRouter.get('/:blogId/posts',
    blogsMiddleware.setDefaultPaging.bind(blogsMiddleware),
    blogsController.getPostsByBlogId.bind(blogsController))

blogsRouter.get('/:id',
    blogsController.getBlogById.bind(blogsController))

blogsRouter.put('/:id',
    blogsValidation.name.bind(blogsValidation),
    blogsValidation.description.bind(blogsValidation),
    blogsValidation.websiteUrl.bind(blogsValidation),
    authorizationMiddleware.basic.bind(authorizationMiddleware),
    blogsValidation.id.bind(blogsValidation),
    errorMiddleware.error.bind(errorMiddleware),
    blogsController.updateBlogById.bind(blogsController))

blogsRouter.delete('/:id',
    authorizationMiddleware.basic.bind(authorizationMiddleware),
    blogsValidation.id.bind(blogsValidation),
    blogsController.deleteBlogById.bind(blogsController))