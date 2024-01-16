import express from 'express'
import {blogRouterQuery} from "./routers/blogs/blogs-routers-Query";
import {blogRouter} from './routers/blogs/blogs-routers';
import {postRouter} from "./routers/posts/posts-routers";
import {userRouter} from "./routers/users/users-routers";
import {userRouterQuery} from "./routers/users/users-routers-Query";
import {dellAllRouter} from "./routers/all-data-routers";
import {postRouterQuery} from "./routers/posts/posts-routers-Query";
import {authRouters} from "./routers/auth-routers";
import {commentRouter} from "./routers/comments/comments-routers";
import {mailRouter} from "./routers/mail-router";
import cookieParser from 'cookie-parser'
import {securityRouter} from "./routers/security-router";

export const app = express()

const parserMiddleware = express.json()

app.use(parserMiddleware)
app.use(cookieParser())

export const routePaths = {
    deleteAllData: '/testing/all-data',
    blogs: '/blogs',
    posts: '/posts',
    users: '/users',
    auth: '/auth',
    comments: '/comments',
    security: '/security/devices'
}

app.use(routePaths.deleteAllData, dellAllRouter)
app.use(routePaths.blogs, blogRouter, blogRouterQuery)
app.use(routePaths.posts, postRouter, postRouterQuery)
app.use(routePaths.users, userRouter, userRouterQuery)
app.use(routePaths.auth, authRouters, mailRouter)
app.use(routePaths.comments, commentRouter)
app.use(routePaths.security, securityRouter)