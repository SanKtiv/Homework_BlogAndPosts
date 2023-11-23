
import {OutputAcesAuthModelType} from "./types-users";


declare global {
    namespace Express {
        export interface Request {
            user: OutputAcesAuthModelType | null
        }
    }
}