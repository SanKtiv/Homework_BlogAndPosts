import {ApiRequestType} from "../types/count-request-types";
import {ApiRequestRepository} from "../repositories/mongodb-repository/api-request-repository/count-request-mongodb";

export class ApiRequestService {

    constructor(protected apiRequestRepository: ApiRequestRepository) {}

    async createApiRequest(apiRequest: ApiRequestType) {

        await this.apiRequestRepository.insertApiRequest(apiRequest)
    }

    async getAllApiRequestsByUri(apiRequest: ApiRequestType) {

        return this.apiRequestRepository.getAllApiRequestsByUri(apiRequest)
    }

    async getAllApiRequests() {

        return this.apiRequestRepository.getAllApiRequests()
    }

    async getCountOfApiRequests(limit: number, apiRequest: ApiRequestType) {

        const countOfRequest = await this.apiRequestRepository.getCountOfApiRequests(apiRequest)

        return countOfRequest.length > limit
    }
}

// export const apiRequestService = {
//
//     async createApiRequest(apiRequest: ApiRequestType) {
//         await apiRequestRepository.insertApiRequest(apiRequest)
//     },
//
//     async getAllApiRequestsByUri(apiRequest: ApiRequestType) {
//         return apiRequestRepository.getAllApiRequestsByUri(apiRequest)
//     },
//
//     async getAllApiRequests() {
//         return apiRequestRepository.getAllApiRequests()
//     },
//
//     async getCountOfApiRequests(limit: number, apiRequest: ApiRequestType) {
//         const countOfRequest = await apiRequestRepository.getCountOfApiRequests(apiRequest)
//
//         return countOfRequest.length > limit
//     }
// }