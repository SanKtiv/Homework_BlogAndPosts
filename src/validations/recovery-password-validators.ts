import {body} from "express-validator";
import {authService} from "../services/auth-service";

const newPassword = body('newPassword')
    .isString().withMessage('newPassword is not string')
    .trim()
    .isLength({min: 6, max: 20}).withMessage('newPassword length is incorrect')

const recoveryCode = body('recoveryCode')
    .isString().withMessage('recoveryCode is not string')
    .trim()
    .isLength({min: 1}).withMessage('recoveryCode is empty string')
    .custom(async code => {
        const ExpDate = await authService.getExpDateOfRecoveryCode(code)
        if (!ExpDate) throw new Error('ExpDate is null')
        if (ExpDate <= new Date()) throw new Error('ExpDate is expired')
    })

export const recoveryPassValid = [newPassword, recoveryCode]