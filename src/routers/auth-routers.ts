import {Router, Request, Response} from "express";
import {userService} from "../services/users-service";
import {userAuthValid} from "../validations/users-validators";
import {validErrors} from "../validations/middlewares";
import {jwtService} from "../applications/jwt-service";
import {WithId} from "mongodb";
import {OutputAcesAuthModelType, UserDbType, UserType} from "../types/types-users";
//import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb-Query";
import {jwtAuth} from "../validations/new-middleware";

export const authRouters = Router({})

authRouters.post('/auth/login', userAuthValid, validErrors, async (req: Request, res: Response) => {

    const user: WithId<UserDbType> | null = await userService
        .checkCredentials(req.body.loginOrEmail, req.body.password)

    if (user) {
        const token = await jwtService.createJWT(user)
        return res.status(200).send(token)
    }
    return res.sendStatus(401)
})

authRouters.get('/auth/me', jwtAuth, async (req: Request, res: Response) => {

    const returnedBody = ({email, login, _id}: UserType) => {
        return {
            email: email,
            login: login,
            userId: _id
        }
    }
    return res.status(200).send(returnedBody(req.user!))
})