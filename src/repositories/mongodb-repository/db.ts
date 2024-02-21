import dotenv from 'dotenv'
import {MongoClient, WithId} from 'mongodb'
import {PostType} from "../../types/posts-types";
import {UserDBType, UserType} from "../../types/users-types";
import {CommentType} from "../../types/comments-types";
import {BlogType} from "../../types/blogs-types";
import {UserSessionType} from "../../types/security-device-types";
import {ApiRequestType} from "../../types/count-request-types";
import mongoose from 'mongoose'

dotenv.config()

const dbName = '/home_works'
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

export const BlogSchema = new mongoose.Schema<BlogType>({
    //id: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean,
    //versionKey: false
}, { versionKey: false })

export const BlogModel = mongoose.model('blogs1', BlogSchema)

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

        await mongoose.connect(mongoURI + dbName)
        console.log('Connect mongoose is ok')
    } catch(e) {
        console.log('no connection')
        await client.close()
    }
}