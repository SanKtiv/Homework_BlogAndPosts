import {IdUserType, InputUserType, UserType} from "../../types/types-users";
import {dateNow} from "../../variables/variables";
import {dbUsersCollection} from "./db";
import {ObjectId, WithId} from "mongodb";

export const usersRepository = {

    addIdToUser(user: WithId<UserType>): IdUserType {

        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },

    async createUser(body: InputUserType): Promise<IdUserType> {

        const user: UserType = {
            login: body.login,
            email: body.email,
            createdAt: dateNow().toISOString()
        }

        await dbUsersCollection.insertOne(user)

        return this.addIdToUser(user as WithId<UserType>)
    },

    async deleteById(id: string): Promise<boolean> {
        const delUser = await dbUsersCollection.deleteOne({_id: new ObjectId(id)})
        return delUser.deletedCount === 1
    },
    
    async deleteAll(): Promise<void> {
        await dbUsersCollection.deleteMany({})
    }
}