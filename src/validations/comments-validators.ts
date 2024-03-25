import {body, param} from "express-validator";

class CommentsValidation {

    async postId() {

        await param('postId')
            .trim()
            .isString().withMessage('postId is not string')
    }

    async content() {

        await body('content')
            .isString().withMessage('content is not string')
            .trim()
            .isLength({min: 20, max: 300}).withMessage('content has incorrect length')
    }

    async id() {

        await param('id')
            .trim()
            .isLength({min: 1}).withMessage('id is empty')
    }

    async commentId() {

        await param('commentId')
            .trim()
            .isLength({min: 1}).withMessage('id is empty')
    }
}

export const commentsValidation = new CommentsValidation()

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