import {NextFunction, Response, Request} from "express";
import {jwtService} from "../applications/jwt-service";
import {userApplication} from "../applications/user-application";
import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb/users-mongodb-Query";

let n = 0
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
console.log(`Запуск №:${n++}`, req.cookies.refreshToken)
    const invalidRefreshJWT = await jwtService.getInvalidRefreshJWT(req.cookies.refreshToken)
    console.log('#2', invalidRefreshJWT)
    if (invalidRefreshJWT) return res.sendStatus(401)

    const result = await jwtService.checkRefreshToken(req.cookies.refreshToken)
    console.log('#3', result)
    if (!result) return res.sendStatus(401)
    console.log('#4')
    req.user = await userApplication.createReqUserByUserId(result)
    return next()
}