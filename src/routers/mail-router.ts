import nodemailer from 'nodemailer'
import {Request, Response, Router} from 'express'

export const mailRouter = Router({})

mailRouter.post('/registration', async (req: Request, res: Response) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aleksandr.mail.test@gmail.com',
            pass: 'rglgkegtcyunuxds'
        }
    })

    const mailOptions = {
        from: 'Aleksandr <aleksandr.mail.test@gmail.com>',
        to: 'aktitorov@gmail.com',
        subject: 'test mail',
        html: '<h1>this is a test mail.</h1>'
    };

    const info = await transporter.sendMail(mailOptions)

    res.send({stats: 'OK'})

})