import {dbSecurityCollection} from "../db";
import {ObjectId} from "mongodb";
import {UserSessionTypeDB} from "../../../types/security-device-types";

export class DeviceSessionQueryRepository {

    async getDeviceSessionsByDeviceIdAndUserId(deviceId: string, userId: string) {

        return dbSecurityCollection.findOne({userId: userId, _id: new ObjectId(deviceId)})
    }

    async getDeviceByDeviceId(deviceId: string) {

        return dbSecurityCollection.findOne({_id: new ObjectId(deviceId)})
    }

    async getDeviceSessionsByUserId(userId: string): Promise<UserSessionTypeDB[]> {

        return dbSecurityCollection.find({userId: userId}).toArray()
    }
}