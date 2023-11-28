import {ErrorMessType} from "../types/error-types";
import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

const customError = ({msg, path}: any): ErrorMessType => {
    return {
        message: msg,
        field: path
    }
}

export const errorsOfValidate = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        const error = result.array({onlyFirstError: true}).map(error => customError(error))
        res.status(400).send({errorsMessages: error})
    } else next()
}