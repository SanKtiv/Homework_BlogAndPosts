import {Request, Response, Router} from "express";
import {usersQueryDefault} from "../validations/middlewares";
import {validAuthorize} from "../validations/middlewares";
import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb-Query";

export const userRouterQuery = Router({})

userRouterQuery.get('/users', validAuthorize, usersQueryDefault, async (req:Request, res: Response) => {
    const usersForm = await usersRepositoryReadOnly.getAllUsers(req.query)
    res.status(200).send(usersForm)
})