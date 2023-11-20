import express from 'express'
import {blogRouterQuery} from "./routers/blogs-routers-Query";
import {blogRouter} from './routers/blogs-routers';
import {postRouter} from "./routers/posts-routers";
import {userRouter} from "./routers/users-routers";
import {userRouterQuery} from "./routers/users-routers-Query";
import {dellAllRouter} from "./routers/all-data-routers";
import {postRouterQuery} from "./routers/posts-routers-Query";
import {authRouters} from "./routers/auth-routers";
import {commentRouter} from "./routers/comments-routers";

export const app = express()

const parserMiddleware = express.json()

app.use(parserMiddleware)

app.use('/testing/all-data', dellAllRouter)
app.use('/blogs', blogRouter, blogRouterQuery)
app.use('/posts', postRouter, postRouterQuery)
app.use('/users', userRouter, userRouterQuery)
app.use('/auth', authRouters)
app.use('/comments', commentRouter)