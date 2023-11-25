import {User_Type, UserDbType} from "../../types/types-users";
import {dbUsersCollection} from "./db";
import {ObjectId, WithId} from "mongodb";

export const usersRepository = {

    async createUser(user: User_Type): Promise<User_Type> {

        await dbUsersCollection.insertOne(user)

        return user
    },

    async findUserByLoginOrEmail(login: string): Promise<WithId<User_Type> | null> {
        return await dbUsersCollection
            .findOne({$or: [{'accountData.login': login}, {'accountData.email': login}]})// FindOne DB
    },

    async deleteById(id: string): Promise<boolean> {
        const delUser = await dbUsersCollection.deleteOne({_id: new ObjectId(id)})
        return delUser.deletedCount === 1
    },
    
    async deleteAll(): Promise<void> {
        await dbUsersCollection.deleteMany({})
    },

    async updateUserExpirationDate(id: any): Promise<boolean> {
        const result = await dbUsersCollection
            .updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },

    async updateUserConfirmationCode(code: string, email: string, date: Date) {
        const result = await dbUsersCollection
            .updateOne({'accountData.email': email},
                {$set: {'emailConfirmation.confirmationCode': code, 'emailConfirmation.expirationDate': date}})
        return result.modifiedCount === 1
    }
}