import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
dotenv.config()

const mongoURI = process.env.MONGO_URL

export const client = new MongoClient(mongoURI)

export async function runDb() {
    try {
        await client.connect()
        //await client.db('tube').command({ping: 1})
        console.log('Connect successfully to mongo server')
    } catch {
        await client.close()
    }
}