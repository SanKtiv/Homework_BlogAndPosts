import {UserSessionType, UserSessionTypeDB} from "../../types/security-device-types";
import {dbSecurityCollection} from "./db";
import {ObjectId} from "mongodb";

export const deviceSessionRepository = {

    async insertDeviceSession(userSession: UserSessionType): Promise<UserSessionTypeDB> {
        await dbSecurityCollection.insertOne(userSession)
        return userSession as UserSessionTypeDB
    },

    async updateDeviceSession(deviceId: string, lastActiveDate: string, expirationDate: string) {
        return dbSecurityCollection
            .findOneAndUpdate({_id: new ObjectId(deviceId)},
                {$set: {lastActiveDate: lastActiveDate, expirationDate: expirationDate}},
                {returnDocument: 'after'})
    },

    async getDeviceSessionsByDeviceIdAndUserId(deviceId: string, userId: string) {
        return dbSecurityCollection.findOne({userId: userId, _id: new ObjectId(deviceId)})
    },

    async getDeviceByDeviceId(deviceId: string) {
        return dbSecurityCollection.findOne({_id: new ObjectId(deviceId)})
    },

    async getDeviceSessionsByUserId(userId: string): Promise<UserSessionTypeDB[]> {
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