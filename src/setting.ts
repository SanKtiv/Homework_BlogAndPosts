import express from 'express'
import {blogRouter} from './routers/blogs-routers';
import {postRouter} from "./routers/posts-routers";
import {dellAllRouter} from "./routers/all-data-routers";
import {
    validTitle,
    validShortDescription,
    validContent,
    validBlogId, validateBlog
} from "./validations/validations";

export const app = express()
const parserMiddleware = express.json()
app.use(parserMiddleware)

app.use('/', dellAllRouter)
app.use('/blogs', validateBlog(), blogRouter)
app.use('/posts', validTitle, validShortDescription, validContent, validBlogId, postRouter)

//app.use('/blogs?', validateBlog(), blogRouterQuery)