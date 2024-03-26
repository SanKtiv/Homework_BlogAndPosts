import {NextFunction, Response, Request} from "express";
import {JwtService} from "../applications/jwt-service";
import {UsersHandler} from "../routers/users/users-handlers";
import {DeviceSessionQueryRepository} from "../repositories/mongodb-repository/user-sessions-mongodb/user-session-query-mongodb";

class AuthorizationMiddleware {

    private jwtService: JwtService
    private usersHandler: UsersHandler
    private deviceSessionQueryRepository: DeviceSessionQueryRepository

    constructor() {
        this.jwtService = new JwtService()
        this.usersHandler = new UsersHandler()
        this.deviceSessionQueryRepository = new DeviceSessionQueryRepository()
    }

    basic(req: Request, res: Response, next: NextFunction) {

        if (req.headers.authorization === 'Basic YWRtaW46cXdlcnR5') return next()

        return res.sendStatus(401)
    }

    async accessToken(req: Request, res: Response, next: NextFunction) {

        const headersAuth = req.headers.authorization

        if (!headersAuth) return res.sendStatus(401)

        const payload = await this.jwtService.getPayloadAccessToken(headersAuth)

        if (!payload) return res.sendStatus(401)

        req.user = await this.usersHandler.createUserRequest(payload.userId)

        return next()
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {

        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) return res.sendStatus(401)

        const payload = await this.jwtService.getPayloadRefreshToken(refreshToken)

        if (!payload) return res.sendStatus(401)

        const session = await this.deviceSessionQueryRepository
            .getDeviceByDeviceId(payload.deviceId)

        if (!session || session.userId !== payload.userId) return res.sendStatus(401)

        const lastActiveDateFromDB = new Date(payload.iat! * 1000).toISOString()

        if (session.lastActiveDate !== lastActiveDateFromDB) return res.sendStatus(401)

        return next()
    }
}

export const authorizationMiddleware = new AuthorizationMiddleware()

// export const authAccessToken = async (req: Request, res: Response, next: NextFunction) => {
//
//     const headersAuth = req.headers.authorization
//
//     if (!headersAuth) return res.sendStatus(401)
//
//     const payload = await jwtService.getPayloadAccessToken(headersAuth)
//
//     if (!payload) return res.sendStatus(401)
//
//     req.user = await userHandlers.createUserRequest(payload.userId)
//
//     return next()
// }

// export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
//
//     const refreshToken = req.cookies.refreshToken
//
//     if (!refreshToken) return res.sendStatus(401)
//
//     const payload = await jwtService.getPayloadRefreshToken(refreshToken)
//
//     if (!payload) return res.sendStatus(401)
//
//     const session = await deviceSessionQueryRepository
//         .getDeviceByDeviceId(payload.deviceId)
//
//     if (!session || session.userId !== payload.userId) return res.sendStatus(401)
//
//     const lastActiveDateFromDB = new Date(payload.iat! * 1000).toISOString()
//
//     if (session.lastActiveDate !== lastActiveDateFromDB) return res.sendStatus(401)
//
//     return next()
// }