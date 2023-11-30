import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
import {PostType} from "../../types/posts-types";
import {InvalidRefreshTokenType, UserType} from "../../types/users-types";
import {CommentType} from "../../types/comments-types";
import {BlogType} from "../../types/blogs-types";

dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoURI)

const db: string = 'tube'
const postsCollection: string = 'posts'
const blogsCollection: string = 'blogs'
const usersCollection: string = 'users'
const commentsCollection: string = 'comments'
const tokensCollection: string = 'tokens'

export const dbBlogsCollection = client.db(db).collection<BlogType>(blogsCollection)
export const dbPostsCollection = client.db(db).collection<PostType>(postsCollection)
export const dbUsersCollection = client.db(db).collection<UserType>(usersCollection)
export const dbCommentsCollection = client.db(db).collection<CommentType>(commentsCollection)
export const dbTokensCollection = client.db(db).collection<InvalidRefreshTokenType>(tokensCollection)

export async function runDb() {
    try {
        await client.connect()
        await client.db(db).command({ping: 1})
        console.log('Connect successfully to mongo server')
    } catch {
        await client.close()
    }
}