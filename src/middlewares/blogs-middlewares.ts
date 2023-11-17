import {NextFunction, Request, Response} from "express";
import {defaultQuery} from "../variables/variables";
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb";

export const checkBlogByBlogId = async (req: Request, res: Response, next: NextFunction) => {
    const blog = await blogsRepository.getBlogById(req.params.blogId)
    if (blog) return  next()
    return res.sendStatus(404)
}

const querySortBy = ['id', 'title', 'blogId', 'name', 'blogName', 'createdAt']
const querySortDirection = ['asc', 'desc']

export const blogsPaginatorDefault = async (req: Request, res: Response, next: NextFunction) => {

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