import {Request, Response, Router} from 'express'
import {emailAdapter} from "../adapters/mail-adapter";
import {registrationConfirmation} from "../adapters/email-message";
import {userEmail, userEmailResending, userInputValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {authService} from "../services/auth-service";
import {confirmationEmailCode} from "../validations/confirmation-code-validator";

export const mailRouter = Router({})

mailRouter.post('/registration', userInputValid, errorsOfValidate, async (req: Request, res: Response) => {

    const user = await authService.addUserInDB(req.body)
    const sendMessage = await emailAdapter.sendConfirmationCodeByEmail(req.body.email)

    //console.log(sendMessage)
    res.sendStatus(204)

})

mailRouter.post('/registration-confirmation', confirmationEmailCode, errorsOfValidate, async (req: Request, res: Response) => {
    await authService.confirmationRegistration(req.body.code)
    res.sendStatus(204)
})

mailRouter.post('/registration-email-resending', userEmailResending, errorsOfValidate, async (req: Request, res: Response) => {

    console.log(req.body.email)
    await emailAdapter.resendNewConfirmationCodeByEmail(req.body.email)

    res.sendStatus(204)
})