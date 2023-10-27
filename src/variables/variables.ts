import {ErrorType, ErrorMessType} from "../types/types";
import {Result, ValidationError} from "express-validator";

export const regexp = new RegExp('\^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

export const idNumber = () => Date.now().toString()

export let dateNow = new Date



export function errorMessage(errors: Result<ValidationError>): ErrorType {
    const errorsMessages: ErrorMessType[] = []
    for (const elem of errors["errors"]) {
        const err: ErrorMessType = {message: elem.msg, field: elem.path}
        if (!errorsMessages.length || errorsMessages.findIndex(e => e.field === err.field) === -1) {
            errorsMessages.push(err)
        }
    }
    return {errorsMessages}
}