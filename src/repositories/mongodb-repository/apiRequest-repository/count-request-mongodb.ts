import {dbRequestCollection} from "../db";
import {ApiRequestType} from "../../../types/count-request-types";

export class ApiRequestRepository {

    async insertApiRequest(request: ApiRequestType) {
        await dbRequestCollection.insertOne(request)
    }

    async getAllApiRequestsByUri(request: ApiRequestType) {
        return dbRequestCollection
            .find({ip: request.ip, url: request.url})
            .toArray()
    }

    async getAllApiRequests() {
        return dbRequestCollection
            .find({})
            .toArray()
    }

    async getCountOfApiRequests(request: ApiRequestType) {
        return dbRequestCollection
            .find({
                ip: request.ip,
                url: request.url,
                date: {$gte: request.date}
            })
            .toArray()
    }

    async deleteAllApiRequests() {
        await dbRequestCollection.deleteMany({})
    }
}