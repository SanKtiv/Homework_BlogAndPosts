import {Request, Response, Router} from "express";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb";
import {userInputValid} from "../validations/users-validators";
import {validErrors, validAuthorize} from "../validations/validations";

export const userRouter = Router({})

userRouter.post('/', async (req: Request, res: Response) => {

})

userRouter.post('/users',validAuthorize , userInputValid, validErrors, async (req: Request, res: Response) => {
    const user = await usersRepository.createUser(req.body)
    res.status(201).send(user)
})

userRouter.delete('/users/:id', async (req: Request, res: Response) => {
    if (await usersRepository.deleteById(req.params.id)) return res.sendStatus(204)
    return res.sendStatus(404)
})