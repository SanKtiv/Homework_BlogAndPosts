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

    async getAllUserSessionsByUserId(userId: string): Promise<UserSessionTypeDB[]> {

        return dbSecurityCollection.find({userId: userId}).toArray()
    },

    async deleteDeviceSessionByDeviceId(deviceId: string) {

        const result = await dbSecurityCollection.deleteOne({_id: new ObjectId(deviceId)})
        console.log('result.deletedCount', result.deletedCount)
        return result.deletedCount === 1
    },

    async deleteAllDevicesExcludeCurrent(deviceId: string, userId: string) {

        await dbSecurityCollection.deleteMany({userId: userId, $nin: {_id: deviceId}})
    }
}