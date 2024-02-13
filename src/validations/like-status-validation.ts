import {body} from "express-validator";

export const likeStatusBody = body('likeStatus')
    .isString().withMessage('not string')
    .trim()
    .isLength({min: 1}).withMessage('empty string')