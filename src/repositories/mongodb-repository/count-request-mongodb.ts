import {dbRequestCollection} from "./db";
import {ApiRequestType} from "../../types/count-request-types";

export const apiRequestRepository = {

    async insertApiRequest(request: ApiRequestType) {
        await dbRequestCollection.insertOne(request)
    },

    async getCountOfApiRequests(request: ApiRequestType) {
        //const date = new Date(Date.now() - 10)
        return dbRequestCollection
            .find({
                ip: request.ip,
                url: request.url,
                date: {$gte: request.date}
                })
            .toArray()
    }
}