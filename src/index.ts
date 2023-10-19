import express, {Request, Response} from 'express'
import {appRouter} from './routers/routers';

const app = express()
const port = process.env.PORT || 3000

const  parserMiddleware = express.json()
app.use(parserMiddleware)

app.get('/', (req: Request, res: Response) => {
    res.send('HI SAMURAI')
})

app.use('/', appRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})