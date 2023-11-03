import express from 'express'
import {blogRouterQuery} from "./routers/blogs-routers-Query";
import {blogRouter} from './routers/blogs-routers';
import {postRouter} from "./routers/posts-routers";
import {dellAllRouter} from "./routers/all-data-routers";
import {
    validTitle,
    validShortDescription,
    validContent,
    validBlogIdBody, validateBlog
} from "./validations/validations";
import {postRouterQuery} from "./routers/posts-routers-Query";

export const app = express()
const parserMiddleware = express.json()
app.use(parserMiddleware)

app.use('/', dellAllRouter)
app.use('/blogs', validateBlog(), blogRouter, blogRouterQuery)
app.use('/posts', validTitle, validShortDescription, validContent, validBlogIdBody, postRouter, postRouterQuery)

//app.use('/blogs?', validateBlog(), blogRouterQuery)