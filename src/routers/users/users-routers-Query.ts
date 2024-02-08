import {Request, Response, Router} from "express";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";
import {basicAuth} from "../../middlewares/authorization-basic";
import {usersRepositoryReadOnly} from "../../repositories/mongodb-repository/users-mongodb/users-query-mongodb";

export const userRouterQuery = Router({})

userRouterQuery.get('/', basicAuth, usersPaginatorDefault, async (req:Request, res: Response) => {
    const usersForm = await usersRepositoryReadOnly.getAllUsers(req.query)
    res.status(200).send(usersForm)
})