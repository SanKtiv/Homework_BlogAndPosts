import {Request, Response, Router} from 'express'
import {EmailAdapter} from "../adapters/mail-adapter";
import {userEmailResending, userInputValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {AuthService} from "../services/auth-service";
import {confirmationEmailCode} from "../validations/confirmation-code-validator";
import {apiRequests} from "../middlewares/count-api-request-middleware";
import {constants} from "http2";
import {UsersService} from "../services/users-service";

export const mailRouter = Router({})

class MailController {

    private usersService: UsersService
    private emailAdapter: EmailAdapter
    private authService: AuthService

    constructor() {

        this.usersService = new UsersService()
        this.emailAdapter = new EmailAdapter()
        this.authService = new AuthService()
    }

    async createUser(req: Request, res: Response) {

        await this.usersService.createUser(req.body)

        await this.emailAdapter.sendConfirmationCodeByEmail(req.body.email)

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async registrationConfirmation(req: Request, res: Response) {

        await this.authService.confirmationRegistration(req.body.code)

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }

    async resendConfirmationCode(req: Request, res: Response) {

        await this.emailAdapter.resendNewConfirmationCodeByEmail(req.body.email)

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    }
}

const mailController = new MailController()

mailRouter.post('/registration',
    apiRequests,
    ...userInputValid,
    errorsOfValidate,
    mailController.createUser.bind(mailController))

mailRouter.post('/registration-confirmation',
    apiRequests,
    confirmationEmailCode,
    errorsOfValidate,
    mailController.registrationConfirmation.bind(mailController))

mailRouter.post('/registration-email-resending',
    apiRequests,
    userEmailResending,
    errorsOfValidate,
    mailController.resendConfirmationCode.bind(mailController))

// mailRouter.post('/registration',
//     apiRequests,
//     ...userInputValid,
//     errorsOfValidate,
//     async (req: Request, res: Response) => {
//
//         await authService.insertUserInDB(req.body)
//
//         await emailAdapter.sendConfirmationCodeByEmail(req.body.email)
//
//         res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
// })

// mailRouter.post('/registration-confirmation',
//     apiRequests,
//     confirmationEmailCode,
//     errorsOfValidate,
//     async (req: Request, res: Response) => {
//
//     await authService.confirmationRegistration(req.body.code)
//
//     res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
// })

// mailRouter.post('/registration-email-resending', apiRequests, userEmailResending, errorsOfValidate, async (req: Request, res: Response) => {
//
//     await emailAdapter.resendNewConfirmationCodeByEmail(req.body.email)
//
//     res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
// })