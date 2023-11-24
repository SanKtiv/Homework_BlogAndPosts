import {body} from "express-validator";
import {authService} from "../services/auth-service";

export const confirmationEmailCode = body('code')
    .isString().withMessage('code is not string')
    .trim()
    .isLength({min: 1}).withMessage('code is empty')
    .custom(async code => {
        if (!await authService.confirmationRegistration(code)) {
            throw new Error('the confirmation code is incorrect, expired or already been applied')
        }
    })