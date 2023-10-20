import express, {Request, Response} from 'express'
import {appRouter, postRouter} from './routers/routers';
import {
    validName,
    validDescription,
    validWebsiteUrl,
    validTitle,
    validShortDescription,
    validContent,
    validBlogId} from "./validations/validations";

const app = express()
const post = express()
const port1 = process.env.PORT || 3000
const port2 = process.env.PORT || 5000

const parserMiddleware = express.json()
app.use(parserMiddleware)
post.use(parserMiddleware)

app.use(
    validName,
    validDescription,
    validWebsiteUrl
)
post.use(
    validTitle,
    validShortDescription,
    validContent,
    validBlogId
)

// app.get('/', (req: Request, res: Response) => {
//     res.send('HI SAMURAI')
//})

app.use('/', appRouter)
post.use('/', postRouter)

app.listen(port1, () => {
    console.log(`Example app listening on port ${port1}`)
})
post.listen(port2, () => {
    console.log(`Example app listening on port ${port2}`)
})