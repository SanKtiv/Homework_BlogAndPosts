import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
import {PostType, BlogType} from "../../types/typesForMongoDB";
// import {BlogsOutputQueryType} from "../../types/typesForQuery";
dotenv.config()

const mongoURI = /*'mongodb://0.0.0.0:27017' || */process.env.MONGO_URL

export const client = new MongoClient(mongoURI)

const db: string = 'tube'
const postsCollection: string = 'posts'
const blogsCollection: string = 'blogs'

export const dbBlogsCollection = client.db(db).collection<BlogType>(blogsCollection)
export const dbPostsCollection = client.db(db).collection<PostType>(postsCollection)

//export const dbBlogsCollectionForQuery = client.db(db).collection<BlogsOutputQueryType>(blogsCollection)

export async function runDb() {
    try {
        await client.connect()
        await client.db(db).command({ping: 1})
        console.log('Connect successfully to mongo server')
    } catch {
        await client.close()
    }
}