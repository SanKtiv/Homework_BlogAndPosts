import {body} from "express-validator";
import {AuthService} from "../services/auth-service";

class ValidEmailCode {

    private authService: AuthService

    constructor() {

        this.authService = new AuthService()
    }

    async custom(code: string) {

        const result = await this.authService.confirmationRegistration(code)

        if (!result) throw new Error('the confirmation code is incorrect, expired or already been applied')
    }
}

const validEmailCode = new ValidEmailCode

export const confirmationEmailCode = body('code')
    .isString().withMessage('code is not string')
    .trim()
    .isLength({min: 1}).withMessage('code is empty')
    .custom(validEmailCode.custom.bind(validEmailCode))