import {BlogModelOutType, ErrorType, ErrorMessType} from "../types/types";
import {Result, ValidationError, validationResult} from "express-validator";

export const regexp = new RegExp('\^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

export const idNumber = () => Date.now().toString()

export const defaultBlog: BlogModelOutType = {
    id: '1',
    name: 'name',
    description: 'name is name',
    websiteUrl: 'https://name'
}

// export const errorFormatter = ({ location, msg, param, value, nestedErrors}) => {
//     const err: ErrorMessType = {message: msg, field: param}
//     return err
// }
//const result = validationResult(req).formatWith(errorFormatter)

export function errorMessage(errors: Result<ValidationError>): ErrorType {
    const errorsMessages: ErrorMessType[] = []
    for (const elem of errors["errors"]) {
        const err: ErrorMessType = {message: elem.msg, field: elem.path}
        errorsMessages.push(err)
    }
    return {errorsMessages}
}