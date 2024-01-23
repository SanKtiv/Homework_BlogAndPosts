import {ApiRequestType} from "../types/count-request-types";
import {apiRequestRepository} from "../repositories/mongodb-repository/count-request-mongodb";

export const apiRequestService = {

    async createApiRequest(ip: string, url: string, date: Date) {
        const apiRequest: ApiRequestType = {
            ip: ip,
            url: url,
            date: date
        }
        await apiRequestRepository.insertApiRequest(apiRequest)
    },

    async getCountOfApiRequests(limit: number, apiRequest: ApiRequestType) {
        const countOfRequest = await apiRequestRepository
            .getCountOfApiRequests(apiRequest)
        return countOfRequest.length >= limit
    }
}