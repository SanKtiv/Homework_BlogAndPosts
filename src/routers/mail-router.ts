import {Request, Response, Router} from 'express'
import {emailAdapter} from "../adapters/mail-adapter";
import {registrationConfirmation} from "../adapters/email-message";
import {userEmail, userInputValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {authService} from "../services/auth-service";
import {confirmationEmailCode} from "../validations/confirmation-code-validator";

export const mailRouter = Router({})

mailRouter.post('/registration', userInputValid, errorsOfValidate, async (req: Request, res: Response) => {

    const sendMessage = await emailAdapter.sendConfirmationMessage(
        req.body.email,
        registrationConfirmation.subject,
        registrationConfirmation.emailMessage)

    //console.log(sendMessage)
    res.status(204)

})

mailRouter.post('/registration-confirmation', confirmationEmailCode, async (req: Request, res: Response) => {
    await authService.confirmationRegistration(req.body.code)
    res.status(204)
})

mailRouter.post('/registration-email-resending', userEmail, async (req: Request, res: Response) => {

    await emailAdapter.sendConfirmationMessage(
        req.body.email,
        registrationConfirmation.subject,
        registrationConfirmation.emailMessage)

    res.status(204)
})