import {body, param, validationResult} from 'express-validator'
import {regexp} from "../variables/variables"
import {NextFunction, Request, Response} from 'express'
import {BlogModelInType, ErrorMessType} from "../types/typesForMongoDB";
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb";

const blogFormIn: BlogModelInType = {
    name: {field: 'name', length: 15},
    description: {field: 'description', length: 500},
    websiteUrl: {field: 'websiteUrl', length: 100, pattern: regexp}
}
const customError = ({msg, path}: any): ErrorMessType => {
    return {
        message: msg,
        field: path
    }
}

export const errorsOfValidation = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        const error = result.array({onlyFirstError: true}).map(error => customError(error))
        res.status(400).send({errorsMessages: error})
    } else next()
}

//валидатоы можно объеденить в массив, создавать через функцию и т.д.
export const validId = param('id', 'id is incorrect')
    .trim()
    .isString()

export const validName = body('name', `name is incorrect`)
    .isString()
    .trim()
    .isLength({min: 1, max: 15})

export const validDescription = body('description', `description is incorrect`)
    .isString()
    .trim()
    .isLength({min: 1, max: 500})

export const validWebsiteUrl = body('websiteUrl', `websiteUrl is incorrect`)
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
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

export const validBlogIdBody = body('blogId')
    .isString().withMessage('Blog is not string')
    .trim()
    .custom(async id => {
        if (!await blogsRepository.getBlogById(id)) {
            throw new Error('Blog is not exist')
        }
    })

export const validBlogIdMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    const blog = await blogsRepository.getBlogById(req.params.blogId)
    if (blog) return  next()
    return res.sendStatus(404)
}
export const validBlogIdParam = param('blogId', 'blogId length is incorrect')
    .trim()
    .custom(async id => {
        if (!await blogsRepository.getBlogById(id)) {
            throw new Error('Blog is not exist')
        }
    })

export const validateBlog = () => [validName, validDescription, validWebsiteUrl]