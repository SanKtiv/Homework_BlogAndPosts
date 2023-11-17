import {NextFunction, Request, Response} from "express";
import {defaultQuery, defaultUsersQuery} from "../variables/variables";
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb";
import {postsRepositoryQuery} from "../repositories/mongodb-repository/posts-mongodb-Query";

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    req.headers.authorization === 'Basic YWRtaW46cXdlcnR5' ?
        next() :
        res.sendStatus(401)
}

export const validBlogIdMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    const blog = await blogsRepository.getBlogById(req.params.blogId)
    if (blog) return  next()
    return res.sendStatus(404)
}

export const usersQueryDefault = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.query.pageNumber) req.query.pageNumber = defaultUsersQuery.pageNumber
    if (!req.query.pageSize) req.query.pageSize = defaultUsersQuery.pageSize
    if (!req.query.sortBy) req.query.sortBy = defaultUsersQuery.sortBy
    if (!req.query.sortDirection) req.query.sortDirection = defaultUsersQuery.sortDirection

    next()
}

const querySortBy = ['id', 'title', 'blogId', 'name', 'blogName', 'createdAt']
const querySortDirection = ['asc', 'desc']

export const queryBlogIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!querySortBy.find(el => el === req.query.sortBy)) {
        req.query.sortBy = defaultQuery.sortBy
    }

    if (!querySortDirection.find(el => el === req.query.sortDirection)) {
        req.query.sortDirection = defaultQuery.sortDirection
    }

    if (!Number(req.query.pageNumber)) {
        req.query.pageNumber = defaultQuery.pageNumber
    } else if (Number(req.query.pageNumber) < 1) {
        req.query.pageNumber = defaultQuery.pageNumber
    }

    if (!Number(req.query.pageSize)) {
        req.query.pageSize = defaultQuery.pageSize
    } else if (Number(req.query.pageSize) < 1) {
        req.query.pageSize = defaultQuery.pageSize
    }

    next()
}

export const checkPostByPostId = async (req: Request, res: Response, next: NextFunction) => {

    const post = await postsRepositoryQuery.findPostByPostId(req.params.postId)
    if (!post) return res.sendStatus(404)// Если нет return приложение падает, выдает ошибку Cannot set headers after they are sent to the client
    return next()//Если перед res есть return, а здесь нет, то ts выдает ошибку: Not all code paths return a value
}