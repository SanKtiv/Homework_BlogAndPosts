import {WithId} from "mongodb";

export type UserSessionType = {
    ip: string
    title: string
    userId: string
    lastActiveDate: string
    expirationDate: string
}

export type UserSessionTypeDB = WithId<UserSessionType>