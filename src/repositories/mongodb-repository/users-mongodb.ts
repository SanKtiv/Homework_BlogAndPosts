import {UserDbType} from "../../types/types-users";
import {dbUsersCollection} from "./db";
import {ObjectId, WithId} from "mongodb";

export const usersRepository = {

    async createUser(user: UserDbType): Promise<UserDbType> {

        await dbUsersCollection.insertOne(user)

        return user
    },

    async findUserByLoginOrEmail(login: string): Promise<WithId<UserDbType> | null> {
        return await dbUsersCollection.findOne({$or: [{login: login}, {email: login}]})
    },

    async deleteById(id: string): Promise<boolean> {
        const delUser = await dbUsersCollection.deleteOne({_id: new ObjectId(id)})
        return delUser.deletedCount === 1
    },
    
    async deleteAll(): Promise<void> {
        await dbUsersCollection.deleteMany({})
    }
}