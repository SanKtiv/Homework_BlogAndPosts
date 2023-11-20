import {Router, Request, Response} from "express";
import {userService} from "../services/users-service";
import {userAuthValid} from "../validations/users-validators";
import {errorsOfValidate} from "../middlewares/error-validators-middleware";
import {jwtService} from "../applications/jwt-service";
import {WithId} from "mongodb";
import {UserDbType, UserType} from "../types/types-users";
import {authorizationJWT} from "../middlewares/authorization-jwt";

export const authRouters = Router({})

authRouters.post('/login', userAuthValid, errorsOfValidate, async (req: Request, res: Response) => {

    const user: WithId<UserDbType> | null = await userService
        .checkCredentials(req.body.loginOrEmail, req.body.password)

    if (user) {
        const token = await jwtService.createJWT(user)
        return res.status(200).send(token)
    }
    return res.sendStatus(401)
})

authRouters.get('/me', authorizationJWT, async (req: Request, res: Response) => {

    const returnedBody = ({email, login, _id}: UserType) => {
        return {
            email: email,
            login: login,
            userId: _id
        }
    }
    return res.status(200).send(returnedBody(req.user!))
})