import {NextFunction, Response, Request} from "express";
import {jwtService} from "../applications/jwt-service";
import {userApplication} from "../applications/user-application";

export const authorizationJWT = async (req: Request, res: Response, next: NextFunction) => {

    if (req.headers.authorization) {

        const token = req.headers.authorization.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)

        if (!userId) return res.sendStatus(401)

        req.user = await userApplication.getUserById(userId)
        return next()
    }
    res.sendStatus(401)
}