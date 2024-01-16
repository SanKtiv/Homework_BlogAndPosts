import {Request, Response, Router} from "express";

export const securityRouter = Router({})

securityRouter.get('/', async (req: Request, res: Response) => {

    return res.status(200).send({})
})