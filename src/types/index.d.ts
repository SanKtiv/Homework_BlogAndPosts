import {WithId} from "mongodb";
import {UserDbType, UserType} from "./types-users";


declare global {
    namespace Express {
        export interface Request {
            user: UserType | null
        }
    }
}