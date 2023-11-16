import {NextFunction, Response, Request} from "express";
import {jwtService} from "../applications/jwt-service";
import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb-Query";

export const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {

    if (req.headers.authorization) {

        const token = req.headers.authorization.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)

        if (!userId) return res.sendStatus(401)

        req.user = await usersRepositoryReadOnly.getUserById(userId)
        return next()
    }
}