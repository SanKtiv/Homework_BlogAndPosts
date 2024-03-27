import {Request, Response, Router} from 'express';
import {BlogsQueryRepository,} from "../../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";
import {blogsMiddleware} from "../../middlewares/blogs-middlewares";
import {InputPostsPagingType} from "../../types/posts-types";
import {InputBlogsPagingType} from "../../types/blogs-types";
import {PostsHandler} from "../posts/post-handler";
import {JwtService} from "../../applications/jwt-service";
import {BlogsHandler} from "./blog-handlers";
import {constants} from "http2";
import {PostsQueryRepository} from "../../repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";

// export const blogRouterQuery = Router({})

// class BlogsQueryController {
//
//     private postsRepositoryQuery: PostsQueryRepository
//
//     private blogsRepositoryQuery: BlogsQueryRepository
//
//     private blogHandlers: BlogsHandler
//
//     private postHandlers: PostsHandler
//
//     private jwtService: JwtService
//
//     constructor() {
//
//         this.jwtService = new JwtService()
//
//         this.postHandlers = new PostsHandler()
//
//         this.blogHandlers = new BlogsHandler()
//
//         this.postsRepositoryQuery = new PostsQueryRepository()
//
//         this.blogsRepositoryQuery = new BlogsQueryRepository()
//     }
//
//     async getBlogsWithPaging(req: Request, res: Response) {
//
//         const query = req.query as InputBlogsPagingType
//
//         const totalBlogs = query.searchNameTerm ?
//             await this.blogsRepositoryQuery.getTotalBlogsByName(query.searchNameTerm) :
//             await this.blogsRepositoryQuery.getTotalBlogs()
//
//         const blogsPagingDB = await this.blogsRepositoryQuery.getBlogsWithPaging(query)
//
//         const blogsPagingView = await this.blogHandlers
//             .blogPagingViewModel(totalBlogs, blogsPagingDB, query)
//
//         res.status(constants.HTTP_STATUS_OK).send(blogsPagingView)
//     }
//
//     async getPostsByBlogId(req: Request, res: Response) {
//
//         const blogId = req.params.blogId
//
//         const headersAuth = req.headers.authorization
//
//         const query = req.query as InputPostsPagingType
//
//         const totalPostsByBlogId = await this.postsRepositoryQuery.getCountPostsByBlogId(blogId)
//
//         const postsByBlogId = await this.blogsRepositoryQuery.getPostsByBlogId(blogId, query)
//
//         if (!postsByBlogId.length) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
//
//         if (headersAuth) {
//
//             const payLoad = await this.jwtService.getPayloadAccessToken(headersAuth)
//
//             if (payLoad) {
//
//                 const postPagingViewModel = await this.postHandlers
//                     .createPostPagingViewModel(totalPostsByBlogId, postsByBlogId, query, payLoad.userId)
//
//                 return res.status(constants.HTTP_STATUS_OK).send(postPagingViewModel)
//             }
//         }
//
//         const postPagingViewModel = await this.postHandlers
//             .createPostPagingViewModel(totalPostsByBlogId, postsByBlogId, query)
//
//         return res.status(constants.HTTP_STATUS_OK).send(postPagingViewModel)
//     }
//
//     async getBlogById(req: Request, res: Response) {
//
//         const blogDB = await this.blogsRepositoryQuery.getBlogById(req.params.id)
//
//         if (!blogDB) return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
//
//         const blog = await this.blogHandlers.blogViewModel(blogDB)
//
//         return res.status(constants.HTTP_STATUS_OK).send(blog)
//     }
// }
//
// const blogsQueryController = new BlogsQueryController()
//
// blogRouterQuery.get('/',
//     blogsMiddleware.setDefaultPaging.bind(blogsMiddleware),
//     blogsQueryController.getBlogsWithPaging.bind(blogsQueryController))
//
// blogRouterQuery.get('/:blogId/posts',
//     blogsMiddleware.setDefaultPaging.bind(blogsMiddleware),
//     blogsQueryController.getPostsByBlogId.bind(blogsQueryController))
//
// blogRouterQuery.get('/:id',
//     blogsQueryController.getBlogById.bind(blogsQueryController))