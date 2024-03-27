import {Router} from 'express'
import {userEmailResending, userInputValid} from "../../validations/users-validators";
import {errorMiddleware} from "../../middlewares/errors-middleware";
import {countRequestsMiddleware, emailValidation, mailController} from "../../composition-root";

export const mailRouter = Router({})

mailRouter.post('/registration',
    countRequestsMiddleware.countRequests.bind(countRequestsMiddleware),
    ...userInputValid,
    errorMiddleware.error.bind(errorMiddleware),
    mailController.createUser.bind(mailController))

mailRouter.post('/registration-confirmation',
    countRequestsMiddleware.countRequests.bind(countRequestsMiddleware),
    emailValidation.confirmationCode.bind(emailValidation),
    errorMiddleware.error.bind(errorMiddleware),
    mailController.registrationConfirmation.bind(mailController))

mailRouter.post('/registration-email-resending',
    countRequestsMiddleware.countRequests.bind(countRequestsMiddleware),
    userEmailResending,
    errorMiddleware.error.bind(errorMiddleware),
    mailController.resendConfirmationCode.bind(mailController))