import {NextFunction, Response, Request} from "express";
import {JwtService} from "../applications/jwt-service";
import {UsersHandler} from "../routers/users/users-handlers";
import {DeviceSessionQueryRepository} from "../repositories/mongodb-repository/user-sessions-mongodb/user-session-query-mongodb";
import {UsersQueryRepository} from "../repositories/mongodb-repository/users-mongodb/users-query-mongodb";

class AuthMiddleware {

    private jwtService: JwtService
    private usersHandler: UsersHandler
    private usersQueryRepository: UsersQueryRepository
    private deviceSessionQueryRepository: DeviceSessionQueryRepository

    constructor() {
        this.jwtService = new JwtService()
        this.usersHandler = new UsersHandler()
        this.usersQueryRepository = new UsersQueryRepository()
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

        const userDB = await this.usersQueryRepository.getUserByUserId(payload.userId)

        if (userDB) {

            req.user = {
                email: userDB.accountData.email,
                login: userDB.accountData.login,
                userId: userDB._id.toString()
            }
        }

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

export const authMiddleware = new AuthMiddleware()