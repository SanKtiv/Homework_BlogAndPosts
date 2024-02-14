import {body} from "express-validator";

export const likeStatusBody = body('likeStatus')
    .isString().withMessage('not string')
    .trim()
    .isLength({min: 1}).withMessage('empty string')
    .custom(status => {
        if (status === 'None' || status === 'Like' || status === 'Dislike') return true
        return false
    }).withMessage('status incorrect')