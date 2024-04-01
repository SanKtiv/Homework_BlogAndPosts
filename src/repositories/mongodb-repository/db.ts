import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
import {PostType} from "../../types/posts-types";
import {UserType} from "../../types/users-types";
import {CommentDBType, CommentType} from "../../types/comments-types";
import {BlogType} from "../../types/blogs-types";
import {UserSessionType} from "../../types/security-device-types";
import {ApiRequestType} from "../../types/count-request-types";
import mongoose from 'mongoose'
import {BlogSchema, CommentSchema} from "./schemas-mongoose";

dotenv.config()

const dbName = '/mongoose'
const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
//const mongoURI = 'mongodb://0.0.0.0:27017' || process.env.MONGO_URL

export const client = new MongoClient(mongoURI)

const db: string = 'tube'
const postsCollection: string = 'posts'
const blogsCollection: string = 'blogs'
const usersCollection: string = 'users'
const commentsCollection: string = 'comments'
const securityCollection: string = 'users-sessions'
const countReqCollection: string = 'requests'

// export const BlogSchema = new mongoose.Schema<BlogType>({
//     //id: { type: String, require: true },
//     name: {type: String, require: true},
//     description: {type: String, require: true},
//     websiteUrl: String,
//     createdAt: String,
//     isMembership: Boolean,
//     //versionKey: false
// }, {versionKey: false})

// const CommentSchema = new mongoose.Schema<CommentDBType>({
//     content: {type: String, require: true},
//     commentatorInfo: {
//         userId: {type: String, require: true},
//         userLogin: {type: String, require: true},
//     },
//     createdAt: {type: String, require: true},
//     postId: {type: String, require: true},
//     likesInfo: {likesCount: Number, dislikesCount: Number,},
//     usersLikeStatuses: [{userId: String, userStatus: String,}]
// },{versionKey: false})

export const BlogsModel = mongoose.model(blogsCollection, BlogSchema)
export const CommentsModel = mongoose.model('comments', CommentSchema)

export const dbBlogsCollection = client.db(db).collection<BlogType>(blogsCollection)
export const dbPostsCollection = client.db(db).collection<PostType>(postsCollection)
export const dbUsersCollection = client.db(db).collection<UserType>(usersCollection)
export const dbCommentsCollection = client.db(db).collection<CommentType>(commentsCollection)
export const dbSecurityCollection = client.db(db).collection<UserSessionType>(securityCollection)
export const dbRequestCollection = client.db(db).collection<ApiRequestType>(countReqCollection)

export async function runDb() {
    try {
        await client.connect()
        await client.db(db).command({ping: 1})
        console.log('Connect successfully to mongo server')

        await mongoose.connect(mongoURI)
        console.log('Connect mongoose is ok')
    } catch(e) {
        console.log('no connection')
        await client.close()
        await mongoose.disconnect()
    }
}