import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
import {BlogModelOutType, PostModelOutType, BlogType} from "../types/typesForMongoDB";
dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoURI)

const db: string = 'tube'
const postsCollection: string = 'posts'
const blogsCollection: string = 'blogs'

export const dbBlogsCollection = client.db(db).collection<BlogModelOutType>(blogsCollection)
export const dbPostsCollection = client.db(db).collection<PostModelOutType>(postsCollection)

export async function runDb() {
    try {
        await client.connect()
        //await client.db('tube').command({ping: 1})
        console.log('Connect successfully to mongo server')
    } catch {
        await client.close()
    }
}