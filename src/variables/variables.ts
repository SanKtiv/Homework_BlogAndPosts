import {BlogModelOutType, ErrorType, ErrorMessType, PostModelOutType} from "../types/types";
import {Result, ValidationError} from "express-validator";

export const regexp = new RegExp('\^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

export const idNumber = () => Date.now().toString()

export const defaultBlog: BlogModelOutType = {
    id: '1',
    name: 'name',
    description: 'name is name',
    websiteUrl: 'https://name'
}

export const defaultPost: PostModelOutType = {
    id: '1',
    title: 'title',
    shortDescription: 'string',
    content: 'string',
    blogId: '123',
    blogName: 'name'
}

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