
import {apiRequestService} from "../services/count-request-service";
import {ApiRequestType} from "../types/count-request-types";
import {Request, Response, NextFunction} from "express";

export const apiRequests = async (req: Request, res: Response, next: NextFunction) => {


    const apiRequest: ApiRequestType = {
        ip: req.header('x-forwarded-for') || req.ip,
        url: req.baseUrl || req.originalUrl,
        date: new Date()
    }
    const limitRequest = await apiRequestService.getCountOfApiRequests(5, apiRequest)
}