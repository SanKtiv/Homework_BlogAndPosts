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
import {mailRouter} from "./routers/mail-router";

export const app = express()

const parserMiddleware = express.json()

app.use(parserMiddleware)

export const routePaths = {
    deleteAllData: '/testing/all-data',
    blogs: '/blogs',
    posts: '/posts',
    users: '/users',
    auth: '/auth',
    comments: '/comments'
}

app.use(routePaths.deleteAllData, dellAllRouter)
app.use(routePaths.blogs, blogRouter, blogRouterQuery)
app.use(routePaths.posts, postRouter, postRouterQuery)
app.use(routePaths.users, userRouter, userRouterQuery)
app.use(routePaths.auth, authRouters, mailRouter)
app.use(routePaths.comments, commentRouter)