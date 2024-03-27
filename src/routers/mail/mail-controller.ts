import {UsersService} from "../../services/users-service";
import {EmailAdapter} from "../../adapters/mail-adapter";
import {AuthService} from "../../services/auth-service";
import {Request, Response} from "express";
import {constants} from "http2";

export class MailController {

    constructor(protected usersService: UsersService,
                protected emailAdapter: EmailAdapter,
                protected authService: AuthService) {}

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