import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
import {PostType, BlogType} from "../../types/typesForMongoDB";
import {User_Type, UserDbType} from "../../types/types-users";
import {CommentDBType} from "../../types/types-comments";

dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoURI)

const db: string = 'tube'
const postsCollection: string = 'posts'
const blogsCollection: string = 'blogs'
const usersCollection: string = 'users'
const commentsCollection: string = 'comments'

export const dbBlogsCollection = client.db(db).collection<BlogType>(blogsCollection)
export const dbPostsCollection = client.db(db).collection<PostType>(postsCollection)
export const dbUsersCollection = client.db(db).collection<User_Type>(usersCollection)
export const dbCommentsCollection = client.db(db).collection<CommentDBType>(commentsCollection)

export async function runDb() {
    try {
        await client.connect()
        await client.db(db).command({ping: 1})
        console.log('Connect successfully to mongo server')
    } catch {
        await client.close()
    }
}