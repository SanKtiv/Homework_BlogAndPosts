import {UserSessionType, UserSessionTypeDB} from "../../types/security-device-types";
import {dbSecurityCollection} from "./db";
import {ObjectId} from "mongodb";

export const userSessionRepository = {

    async insertUserSession(userSession: UserSessionType): Promise<UserSessionTypeDB> {

        await dbSecurityCollection.insertOne(userSession)
        return userSession as UserSessionTypeDB
    },

    async updateUserSession(deviceId: string, lastActiveDate: string, expirationDate: string) {

        return dbSecurityCollection
            .findOneAndUpdate({_id: new ObjectId(deviceId)},
                {$set: {lastActiveDate: lastActiveDate, expirationDate: expirationDate}},
                {returnDocument: 'after'})
    },

    async getUserSessionByDeviceId(deviceId: string) {

        const result = await dbSecurityCollection.findOne({_id: new ObjectId(deviceId)})

    }
}