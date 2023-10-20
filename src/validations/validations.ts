import {body, param, validationResult, ResultFactory, Result} from 'express-validator'
import {regexp} from "../variables/variables";
import {NextFunction} from 'express'

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




