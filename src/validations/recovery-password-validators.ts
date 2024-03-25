import {body} from "express-validator";
import {AuthService} from "../services/auth-service";

export class AuthValidation {

    private authService: AuthService

    constructor() {

        this.authService = new AuthService()
    }

    async customRecoveryCode(code: string) {

        const ExpDate = await this.authService.getExpDateOfRecoveryCode(code)

        if (!ExpDate) throw new Error('Recovery code is incorrect')

        if (ExpDate <= new Date()) throw new Error('ExpDate is expired')
    }

    async password() {

        await body('newPassword')
            .isString().withMessage('newPassword is not string')
            .trim()
            .isLength({min: 6, max: 20}).withMessage('newPassword length is incorrect')
    }

    async recoveryCode() {

        await body('recoveryCode')
            .isString().withMessage('recoveryCode is not string')
            .trim()
            .isLength({min: 1}).withMessage('recoveryCode is empty string')
            .custom(this.customRecoveryCode.bind(this))
    }
}

export const authValidation = new AuthValidation()

// export const ValidNewPassword = body('newPassword')
//     .isString().withMessage('newPassword is not string')
//     .trim()
//     .isLength({min: 6, max: 20}).withMessage('newPassword length is incorrect')
//
// export const ValidRecoveryCode = body('recoveryCode')
//     .isString().withMessage('recoveryCode is not string')
//     .trim()
//     .isLength({min: 1}).withMessage('recoveryCode is empty string')
//     .custom(async code => {
//         const ExpDate = await authService.getExpDateOfRecoveryCode(code)
//         if (!ExpDate) throw new Error('Recovery code i incorrect')
//         if (ExpDate <= new Date()) throw new Error('ExpDate is expired')
//     })

// export const recoveryPassValid = [ValidNewPassword, ValidRecoveryCode]