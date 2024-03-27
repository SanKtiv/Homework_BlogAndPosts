import {NextFunction, Request, Response} from "express";
import {defaultQuery} from "../variables/variables";
import {BlogsQueryRepository} from "../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";

export class BlogsMiddleware {

    constructor(protected blogsRepositoryQuery: BlogsQueryRepository) {}

    async existBlog(req: Request, res: Response, next: NextFunction) {

        const blogDB = await this.blogsRepositoryQuery.getBlogById(req.params.blogId)

        if (blogDB) return  next()

        return res.sendStatus(404)
    }

    async setDefaultPaging(req: Request, res: Response, next: NextFunction) {

        const querySortBy = ['id', 'title', 'blogId', 'name', 'blogName', 'createdAt']
        const querySortDirection = ['asc', 'desc']

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
}