import {Router} from 'express';
import {blogsValidation} from "../../validations/blogs-validators";
import {postsValidation} from "../../validations/posts-validators";
import {errorMiddleware} from "../../middlewares/errors-middleware";
import {authMiddleware} from "../../middlewares/auth-middleware";
import {blogsController, blogsMiddleware} from "../../composition-root";

export const blogsRouter = Router({})

blogsRouter.post('/',
    blogsValidation.name.bind(blogsValidation),
    blogsValidation.description.bind(blogsValidation),
    blogsValidation.websiteUrl.bind(blogsValidation),
    authMiddleware.basic.bind(authMiddleware),
    errorMiddleware.error.bind(errorMiddleware),
    blogsController.createBlog.bind(blogsController))

blogsRouter.post('/:blogId/posts',
    postsValidation.title.bind(postsValidation),
    postsValidation.shortDescription.bind(postsValidation),
    postsValidation.content.bind(postsValidation),
    authMiddleware.basic.bind(authMiddleware),
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
    authMiddleware.basic.bind(authMiddleware),
    blogsValidation.id.bind(blogsValidation),
    errorMiddleware.error.bind(errorMiddleware),
    blogsController.updateBlogById.bind(blogsController))

blogsRouter.delete('/:id',
    authMiddleware.basic.bind(authMiddleware),
    blogsValidation.id.bind(blogsValidation),
    blogsController.deleteBlogById.bind(blogsController))