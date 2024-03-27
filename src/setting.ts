import express from 'express'
import {blogsRouter} from './routers/blogs/blogs-routers';
import {postRouter} from "./routers/posts/posts-routers";
import {userRouter} from "./routers/users/users-routers";
import {dellAllRouter} from "./routers/testing/all-data-routers";
import {authRouters} from "./routers/auth/auth-routers";
import {commentRouter} from "./routers/comments/comments-routers";
import {mailRouter} from "./routers/mail/mail-router";
import cookieParser from 'cookie-parser'
import {securityRouter} from "./routers/security/security-router";

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
app.use(routePaths.blogs, blogsRouter)
app.use(routePaths.posts, postRouter)
app.use(routePaths.users, userRouter)
app.use(routePaths.auth, authRouters, mailRouter)
app.use(routePaths.comments, commentRouter)
app.use(routePaths.security, securityRouter)