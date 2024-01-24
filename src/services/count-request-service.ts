import {ApiRequestType} from "../types/count-request-types";
import {apiRequestRepository} from "../repositories/mongodb-repository/count-request-mongodb";

export const apiRequestService = {

    async createApiRequest(apiRequest: ApiRequestType) {

        await apiRequestRepository.insertApiRequest(apiRequest)
    },

    async getCountOfApiRequests(limit: number, apiRequest: ApiRequestType) {
        const countOfRequest = await apiRequestRepository
            .getCountOfApiRequests(apiRequest)
        console.log(countOfRequest)
        return countOfRequest.length >= limit
    }
}