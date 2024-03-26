import {body, param, ValidationChain} from "express-validator";

class CommentsValidation {

    public id: ValidationChain
    public postId: ValidationChain
    public content: ValidationChain
    public commentId: ValidationChain

    constructor() {

        this.id = param('id')
            .trim()
            .isLength({min: 1}).withMessage('id is empty')

        this.postId = param('postId')
            .trim()
            .isString().withMessage('postId is not string')

        this.content = body('content')
            .isString().withMessage('content is not string')
            .trim()
            .isLength({min: 20, max: 300}).withMessage('content has incorrect length')

        this.commentId = param('commentId')
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