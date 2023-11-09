import express from 'express'
import {blogRouterQuery} from "./routers/blogs-routers-Query";
import {blogRouter} from './routers/blogs-routers';
import {postRouter} from "./routers/posts-routers";
import {dellAllRouter} from "./routers/all-data-routers";
import {postRouterQuery} from "./routers/posts-routers-Query";

export const app = express()
const parserMiddleware = express.json()
app.use(parserMiddleware)

app.use('/', dellAllRouter)
app.use('/', blogRouter, blogRouterQuery)
app.use('/', postRouter, postRouterQuery)