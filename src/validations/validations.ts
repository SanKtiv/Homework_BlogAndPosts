import {body, param, validationResult} from 'express-validator'
import {errorMessage, regexp} from "../variables/variables"
import {NextFunction, Request, Response} from 'express'
import {BlogModelInType} from "../types/types";

const blogFormIn: BlogModelInType = {
    name: {field: 'name', length: 15},
    description: {field: 'description', length: 500},
    websiteUrl: {field: 'websiteUrl', length: 100, pattern: regexp}
}

export const errorOfValid = (req: Request, res: Response, next: NextFunction) => {
    if (validationResult(req).isEmpty()) {
        next()
    }
    res.status(400).send(validationResult(req))
}
//валидатоы можно объеденить в массив, создавать через функцию и т.д.
export const validId = param('id', 'id is incorrect')
    .trim()
    .isString()

export const validName = body(blogFormIn.name.field, `${blogFormIn.name.field} is incorrect`)
    .isString()
    .trim()
    .isLength({max: blogFormIn.name.length})

export const validDescription = body(blogFormIn.description.field, `${blogFormIn.description.field} is incorrect`)
    .isString()
    .trim()
    .isLength({max: blogFormIn.description.length})

export const validWebsiteUrl = body(blogFormIn.websiteUrl.field, `${blogFormIn.websiteUrl.field} is incorrect`)
    .isString()
    .trim()
    .isLength({max: blogFormIn.websiteUrl.length})
    .matches(blogFormIn.websiteUrl.pattern)

export const validAuthorize = (req: Request, res: Response, next: NextFunction) => {
    req.headers.authorization === 'Basic YWRtaW46cXdlcnR5' ?
        next() :
        res.sendStatus(401)
}
///////////////////////////////////////
export const validTitle = body('title', 'title length is incorrect')
    .isString()
    .trim()
    .isLength({min: 1, max: 30})

export const validShortDescription = body('shortDescription', 'shortDescription length is incorrect')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})

export const validContent = body('content', 'content length is incorrect')
    .isString()
    .trim()
    .isLength({min: 1, max: 1000})

export const validBlogId = body('blogId', 'blogId length is incorrect')
    .isString()
    .trim()
    .isLength({min: 6})// добавить кастом валидацию: проверить есть ли в базе post с заданным blogId

export const validateBlog = () => [validName, validDescription, validWebsiteUrl]