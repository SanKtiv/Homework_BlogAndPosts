import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {defaultUsersQuery} from "../variables/variables";

const loginRegex = new RegExp('^[a-zA-Z0-9_-]*$')
//const emailRegex = new RegExp('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')

export const userLogin = body('login')
    .isString().withMessage('login is not string')
    .trim()
    .isLength({min: 3, max: 10}).withMessage('login length is incorrect')
    .matches(loginRegex).withMessage('login have invalid characters')

export const userPassword = body('password')
    .isString().withMessage('password is not string')
    .trim()
    .isLength({min: 6, max: 20}).withMessage('password length is incorrect')

export const userEmail = body('email')
    .isString().withMessage('email is not string')
    .trim()
    .matches(/^[\w-\.]+@([\w-]+.)+[\w-]{2,4}$/).withMessage('email have invalid characters')

export const userInputValid = [userLogin, userPassword, userEmail]

export const usersQueryDefault = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.query.pageNumber) req.query.pageNumber = defaultUsersQuery.pageNumber
    if (!req.query.pageSize) req.query.pageSize = defaultUsersQuery.pageSize
    if (!req.query.sortBy) req.query.sortBy = defaultUsersQuery.sortBy
    if (!req.query.sortDirection) req.query.sortDirection = defaultUsersQuery.sortDirection

    next()
}