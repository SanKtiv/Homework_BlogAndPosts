import {Request, Response, Router} from 'express'
import {emailAdapter} from "../adapters/mail-adapter";
import {userEmailResending, userInputValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {authService} from "../services/auth-service";
import {confirmationEmailCode} from "../validations/confirmation-code-validator";

export const mailRouter = Router({})

mailRouter.post('/registration', userInputValid, errorsOfValidate, async (req: Request, res: Response) => {
    const user = await authService.insertUserInDB(req.body)
    const sendMessage = await emailAdapter.sendConfirmationCodeByEmail(req.body.email)
    res.sendStatus(204)

})

mailRouter.post('/registration-confirmation', confirmationEmailCode, errorsOfValidate, async (req: Request, res: Response) => {
    await authService.confirmationRegistration(req.body.code)
    res.sendStatus(204)
})

mailRouter.post('/registration-email-resending', userEmailResending, errorsOfValidate, async (req: Request, res: Response) => {
    await emailAdapter.resendNewConfirmationCodeByEmail(req.body.email)
    res.sendStatus(204)
})