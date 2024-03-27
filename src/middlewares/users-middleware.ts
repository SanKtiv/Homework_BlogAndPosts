import {NextFunction, Request, Response} from "express";
import {defaultUsersQuery} from "../variables/variables";

export const usersPaginatorDefault = async function(req: Request, res: Response, next: NextFunction) {

    if (!req.query.pageNumber) req.query.pageNumber = defaultUsersQuery.pageNumber
    if (!req.query.pageSize) req.query.pageSize = defaultUsersQuery.pageSize
    if (!req.query.sortBy) req.query.sortBy = defaultUsersQuery.sortBy
    if (!req.query.sortDirection) req.query.sortDirection = defaultUsersQuery.sortDirection

    next()
}