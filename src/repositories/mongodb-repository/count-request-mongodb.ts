import {dbRequestCollection} from "./db";
import {ApiRequestType} from "../../types/count-request-types";

export const apiRequestRepository = {

    async insertApiRequest(request: ApiRequestType) {
        await dbRequestCollection.insertOne(request)
    },

    async getCountOfApiRequests(request: ApiRequestType) {
        return dbRequestCollection
            .find({
                ip: request.ip,
                url: request.url,
                date: {$gte: request.date}
                })
            .toArray()
    },

    async deleteAllApiRequests() {
        await dbRequestCollection.deleteMany({})
    }
}