import {Request, Response, Router} from "express";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb";

export const userRouter = Router({})

userRouter.post('/users', async (req: Request, res: Response) => {

    const user = await usersRepository.createUser(req.body)
    res.status(201).send(user)
})