
import {RequestUserType} from "./users-types";


declare global {
    namespace Express {
        export interface Request {
            user: RequestUserType | null
        }
    }
}