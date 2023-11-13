import {body, param} from 'express-validator'
import {regexp} from "../variables/variables"

export const validId = param('id', 'id is incorrect')
    .trim()
    .isString()

const validName = body('name', `name is incorrect`)
    .isString()
    .trim()
    .isLength({min: 1, max: 15})

const validDescription = body('description', `description is incorrect`)
    .isString()
    .trim()
    .isLength({min: 1, max: 500})

const validWebsiteUrl = body('websiteUrl', `websiteUrl is incorrect`)
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .matches(regexp)

export const validBlog = [validName, validDescription, validWebsiteUrl]


