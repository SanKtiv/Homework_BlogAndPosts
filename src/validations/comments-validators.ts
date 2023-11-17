import {body, param} from "express-validator";

const checkPostIdForComments = param('postId')
    .trim()
    .isString().withMessage('postId is not string')

const checkContent = body('content')
    .isString().withMessage('content is not string')
    .trim()
    .isLength({min: 20, max: 300}).withMessage('content has incorrect length')

export const checkInputFormComment = [checkPostIdForComments, checkContent]

export const checkId = param('id')
    .trim()
    .isLength({min: 1}).withMessage('id is empty')

const checkCommentId = param('commentId')
    .trim()
    .isLength({min: 1}).withMessage('id is empty')

export const checkCommentModelForUpdate = [checkCommentId, checkContent]