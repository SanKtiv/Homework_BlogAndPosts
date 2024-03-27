import {body, ValidationChain} from "express-validator";
import {AuthService} from "../services/auth-service";

export class EmailValidation {

    public confirmationCode: ValidationChain

    constructor(protected authService: AuthService) {

        this.confirmationCode = body('code')
            .isString().withMessage('code is not string')
            .trim()
            .isLength({min: 1}).withMessage('code is empty')
            .custom(this.customFunc.bind(this))
    }

    async customFunc(code: string) {

        const result = await this.authService.confirmationRegistration(code)

        if (!result) throw new Error('the confirmation code is incorrect, expired or already been applied')
    }
}

//export const emailValidation = new EmailValidation()

// export const confirmationEmailCode = body('code')
//     .isString().withMessage('code is not string')
//     .trim()
//     .isLength({min: 1}).withMessage('code is empty')
//     .custom(emailValidation.customFunc.bind(emailValidation))