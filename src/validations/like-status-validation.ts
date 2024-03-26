import {body, ValidationChain} from "express-validator";

class LikeStatusValidation {

    public likeStatus: ValidationChain

    constructor() {

        this.likeStatus = body('likeStatus')
            .isString().withMessage('not string')
            .trim()
            .isLength({min: 1}).withMessage('empty string')
            .custom(this.customFunc.bind(this)).withMessage('status incorrect')
    }

    customFunc(status: string) {

        if (status === 'None' || status === 'Like' || status === 'Dislike') return true

        return false
    }
}

export const likeStatusValidation = new LikeStatusValidation()

// export const likeStatusBody = body('likeStatus')
//     .isString().withMessage('not string')
//     .trim()
//     .isLength({min: 1}).withMessage('empty string')
//     .custom(status => {
//         if (status === 'None' || status === 'Like' || status === 'Dislike') return true
//         return false
//     }).withMessage('status incorrect')