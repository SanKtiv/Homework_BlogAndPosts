import {NextFunction, Response, Request} from "express";
import {jwtService} from "../applications/jwt-service";
import {userApplication} from "../applications/user-application";
import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb/users-mongodb-Query";

export const authorizationJWT = async (req: Request, res: Response, next: NextFunction) => {
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! if, req.user
    if (req.headers.authorization) {

        const token = req.headers.authorization.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)
        if (!userId) return res.sendStatus(401)
        req.user = await userApplication.createReqUserByUserId(userId)
        return next()
    }
    res.sendStatus(401)
}

export const checkRefreshJWT = async (req: Request, res: Response, next: NextFunction) => {

    const result = await jwtService.checkRefreshToken(req.cookies.refreshToken)
    if (!result) return res.sendStatus(401)
    req.user = await userApplication.createReqUserByUserId(result)
    return next()
}