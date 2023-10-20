import express, {Request, Response} from 'express'
import {appRouter} from './routers/routers';
import {
    validName,
    validDescription,
    validWebsiteUrl,
    validTitle,
    validShortDescription,
    validContent,
    validBlogId} from "./validations/validations";

const app = express()
const port = process.env.PORT || 3000

const parserMiddleware = express.json()
app.use(parserMiddleware)

app.use(
    validName,
    validDescription,
    validWebsiteUrl,validTitle,
    validShortDescription,
    validContent,
    validBlogId
)

app.get('/', (req: Request, res: Response) => {
    res.send('HI SAMURAI')
})

app.use('/', appRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})