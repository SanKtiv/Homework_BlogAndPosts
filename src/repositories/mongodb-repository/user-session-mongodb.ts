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

    async getUserSessionsByDeviceIdAndUserId(deviceId: string, userId: string) {
        return dbSecurityCollection.find({userId: userId, _id: new ObjectId(deviceId)})
    },

    async getAllUserSessionsByUserId(userId: string): Promise<UserSessionTypeDB[]> {
        return dbSecurityCollection.find({userId: userId}).toArray()
    },

    async deleteDeviceSessionByDeviceId(deviceId: string) {
        const result = await dbSecurityCollection.deleteOne({_id: new ObjectId(deviceId)})
        return result.deletedCount === 1
    },

    async deleteAllDevicesExcludeCurrent(deviceId: string, userId: string) {
        const result = await dbSecurityCollection
            .deleteMany({userId: userId, _id: {$nin: [new ObjectId(deviceId)]}})
        return result.acknowledged
    },

    async deleteAllDevices() {
        await dbSecurityCollection.deleteMany({})
    }
}