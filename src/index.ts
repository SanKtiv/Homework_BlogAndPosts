import express from 'express'
import {blogRouter, postRouter, dellAllRouter} from './routers/routers';
import {
    validName,
    validDescription,
    validWebsiteUrl,
    validTitle,
    validShortDescription,
    validContent,
    validBlogId} from "./validations/validations";

const app = express()
const port1 = process.env.PORT || 3000

const parserMiddleware = express.json()
app.use(parserMiddleware)

// app.get('/', (req: Request, res: Response) => {
//     res.send('HI SAMURAI')
//})
app.use('/', dellAllRouter)
app.use('/blogs', validName, validDescription, validWebsiteUrl, blogRouter)
app.use('/posts', validTitle, validShortDescription, validContent, validBlogId, postRouter)

app.listen(port1, () => {
    console.log(`Example app listening on port ${port1}`)
})