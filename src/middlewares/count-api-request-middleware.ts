import {apiRequestService} from "../services/count-request-service";
import {ApiRequestType} from "../types/count-request-types";
import {Request, Response, NextFunction} from "express";

export const apiRequests = async (req: Request, res: Response, next: NextFunction) => {

    const apiRequest: ApiRequestType = {
        ip: req.header('x-forwarded-for') || req.ip,
        url: req.originalUrl || req.baseUrl,
        date: new Date()
    }

    await apiRequestService.createApiRequest(apiRequest)

    const apiRequestLimit = {...apiRequest, date: new Date(Date.now() - 10000)}

    const limitRequest = await apiRequestService
        .getCountOfApiRequests(5, apiRequestLimit)

    if (limitRequest) return res.sendStatus(429)

    return next()
}