import {Request, Response, Router} from "express";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";
import {basicAuth} from "../../middlewares/authorization-basic";
import {usersQueryRepository} from "../../repositories/mongodb-repository/users-mongodb/users-query-mongodb";
import {constants} from "http2";

export const userRouterQuery = Router({})

userRouterQuery.get('/', basicAuth, usersPaginatorDefault, async (req: Request, res: Response) => {

    const usersForm = await usersQueryRepository.getAllUsers(req.query)

    res.status(constants.HTTP_STATUS_OK).send(usersForm)
})