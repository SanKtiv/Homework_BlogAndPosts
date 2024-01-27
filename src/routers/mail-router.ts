import {Request, Response, Router} from 'express'
import {emailAdapter} from "../adapters/mail-adapter";
import {userEmailResending, userInputValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {authService} from "../services/auth-service";
import {confirmationEmailCode} from "../validations/confirmation-code-validator";
import {apiRequests} from "../middlewares/count-api-request-middleware";

export const mailRouter = Router({})

mailRouter.post('/registration', apiRequests, userInputValid, errorsOfValidate, async (req: Request, res: Response) => {
    await authService.insertUserInDB(req.body)
    await emailAdapter.sendConfirmationCodeByEmail(req.body.email)
    res.sendStatus(204)
})

mailRouter.post('/registration-confirmation', apiRequests, confirmationEmailCode, errorsOfValidate, async (req: Request, res: Response) => {
    await authService.confirmationRegistration(req.body.code)
    res.sendStatus(204)
})

mailRouter.post('/registration-email-resending', apiRequests, userEmailResending, errorsOfValidate, async (req: Request, res: Response) => {
    await emailAdapter.resendNewConfirmationCodeByEmail(req.body.email)
    res.sendStatus(204)
})