import {body, ValidationChain} from "express-validator";
import {usersQueryRepository} from "../repositories/mongodb-repository/users-mongodb/users-query-mongodb";

// class UsersValidation {
//
//     public login: ValidationChain
//
//     constructor() {
//
//         this.login = body('login')
//             .isString().withMessage('login is not string')
//             .trim()
//             .isLength({min: 3, max: 10}).withMessage('login length is incorrect')
//             .matches(loginRegex).withMessage('login have invalid characters')
//             .custom(async login => {
//                 if (await usersQueryRepository.getUserByLoginOrEmail(login)) {
//                     throw new Error('This login already use')
//                 }
//             })
//     }
// }

const loginRegex: RegExp = /^[a-zA-Z0-9_-]*$/
const emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const loginOrEmailRegex = /(?:^[\w\-.]+@([\w-]+.)+[\w-]{2,4}$)|(?:^[a-zA-Z0-9_-]*$)/

const userLogin = body('login')
    .isString().withMessage('login is not string')
    .trim()
    .isLength({min: 3, max: 10}).withMessage('login length is incorrect')
    .matches(loginRegex).withMessage('login have invalid characters')
    .custom(async login => {
        if (await usersQueryRepository.getUserByLoginOrEmail(login)) {
            throw new Error('This login already use')
        }
    })

const userPassword = body('password')
    .isString().withMessage('password is not string')
    .trim()
    .isLength({min: 6, max: 20}).withMessage('password length is incorrect')

export const userEmail = body('email')
    .isString().withMessage('email is not string')
    .trim()
    .matches(emailRegex).withMessage('email have invalid characters')
    .custom(async email => {
        if (await usersQueryRepository.getUserByLoginOrEmail(email)) {
            throw new Error('This email already use')
        }
    })

export const userInputValid = [userLogin, userPassword, userEmail]

const userLoginOrEmail = body('loginOrEmail')
    .isString().withMessage('loginOrEmail is not string')
    .trim()
    .matches(loginOrEmailRegex).withMessage('loginOrEmail have invalid characters')

export const userAuthValid = [userLoginOrEmail, userPassword]

export const userEmailResending = body('email')
    .isString().withMessage('email is not string')
    .trim()
    .matches(emailRegex).withMessage('email have invalid characters')
    .custom(async email => {
        const user = await usersQueryRepository.getUserByLoginOrEmail(email)

        if (!user || user.emailConfirmation.isConfirmed) {
            throw new Error('This email is confirmed')
        }
    })

export const emailPasswordRecovery = body('email')
    .isString().withMessage('email is not string')
    .trim()
    .matches(emailRegex).withMessage('email have invalid characters')