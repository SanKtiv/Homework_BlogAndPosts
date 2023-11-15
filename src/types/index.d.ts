import {WithId} from "mongodb";
import {UserDbType} from "./types-users";


declare global {
    namespace Express {
        export interface Request {
            user: WithId<UserDbType> | null
        }
    }
}