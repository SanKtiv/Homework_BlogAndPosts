import {ApiRequestType} from "../types/count-request-types";
import {apiRequestRepository} from "../repositories/mongodb-repository/count-request-mongodb";

export const apiRequestService = {

    async createApiRequest(apiRequest: ApiRequestType) {
        await apiRequestRepository.insertApiRequest(apiRequest)
    },

    async getAllApiRequestsByUri(apiRequest: ApiRequestType) {
        return apiRequestRepository.getAllApiRequestsByUri(apiRequest)
    },

    async getAllApiRequests() {
        return apiRequestRepository.getAllApiRequests()
    },

    async getCountOfApiRequests(limit: number, apiRequest: ApiRequestType) {
        const countOfRequest = await apiRequestRepository.getCountOfApiRequests(apiRequest)

        console.log('COUNT', countOfRequest.length, countOfRequest)
        console.log('ALL', await apiRequestRepository.getAllApiRequests())

        return countOfRequest.length > limit
    }
}