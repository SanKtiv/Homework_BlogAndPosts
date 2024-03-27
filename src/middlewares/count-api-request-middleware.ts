import {ApiRequestService} from "../services/apiRequest-service";
import {ApiRequestType} from "../types/count-request-types";
import {Request, Response, NextFunction} from "express";

export class CountRequestsMiddleware {

    constructor(protected apiRequestService: ApiRequestService) {}

    async countRequests(req: Request, res: Response, next: NextFunction) {

        const apiRequest: ApiRequestType = {
            ip: req.header('x-forwarded-for') || req.ip,
            url: req.originalUrl || req.baseUrl,
            date: new Date()
        }

        await this.apiRequestService.createApiRequest(apiRequest)

        const apiRequestLimit = {...apiRequest, date: new Date(Date.now() - 10000)}

        const limitRequest = await this.apiRequestService
            .getCountOfApiRequests(5, apiRequestLimit)

        if (limitRequest) return res.sendStatus(429)

        return next()
    }
}