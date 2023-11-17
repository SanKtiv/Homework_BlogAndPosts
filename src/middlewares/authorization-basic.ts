import {NextFunction, Request, Response} from "express";

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {

    if (req.headers.authorization === 'Basic YWRtaW46cXdlcnR5') return next()
    res.sendStatus(401)
}