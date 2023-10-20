import {body, param} from 'express-validator'
import {regexp} from "../variables/variables"
import {NextFunction, Request, Response} from 'express'

export const validId = param('id', 'id is incorrect')
    .isString()

export const validName = body('name', 'name length is incorrect')
    .isLength({min: 1, max: 15})
    .isString()

export const validDescription = body('description', 'description length is incorrect')
    .isLength({min: 1, max: 500})
    .isString()

export const validWebsiteUrl = body('websiteUrl', 'URL adress is incorrect')
    .isLength({min: 1, max: 100})
    .isString()
    .matches(regexp)

export const validAuthorize = (req: Request, res: Response, next: NextFunction) => {
    req.headers.authorization === 'Basic YWRtaW46cXdlcnR5' ?
        next() :
        res.sendStatus(401)
}
///////////////////////////////////////
export const validTitle = body('title', 'title length is incorrect')
    .isLength({min: 1, max: 30})
    .isString()

export const validShortDescription = body('shortDescription', 'shortDescription length is incorrect')
    .isLength({min: 1, max: 100})
    .isString()

export const validContent = body('content', 'content length is incorrect')
    .isLength({min: 1, max: 1000})
    .isString()

export const validBlogId = body('blogId', 'blogId length is incorrect')
    .isString()