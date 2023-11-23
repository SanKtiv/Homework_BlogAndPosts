import nodemailer from 'nodemailer'
import {Request, Response, Router} from 'express'

export const mailRouter = Router({})

mailRouter.post('/registration', async (req: Request, res: Response) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aleksandr.mail.test@gmail.com',
            pass: '0434 7188 6698 3518 7865 3952 3038 8149 2671 6222 3416 2908 8743 8153 5391 3503 0581 6262 9116 0537'
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