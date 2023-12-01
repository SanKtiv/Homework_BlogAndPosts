import {RefreshTokenDBType, UserDBType, UserType} from "../../../types/users-types";
import {dbTokensCollection, dbUsersCollection} from "../db";
import {ObjectId} from "mongodb";

export const usersRepository = {

    async insertUserToDB(user: UserType): Promise<UserType> {
        await dbUsersCollection.insertOne(user)
        return user
    },

    async findUserByLoginOrEmail(login: string): Promise<UserDBType | null> {
        return await dbUsersCollection
            .findOne({$or: [{'accountData.login': login}, {'accountData.email': login}]})// FindOne DB
    },

    async deleteUserById(id: string): Promise<boolean> {
        const result = await dbUsersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    
    async deleteAllUsers(): Promise<void> {
        await dbUsersCollection.deleteMany({})
    },

    async updateUserExpirationDate(id: ObjectId): Promise<boolean> {
        const result = await dbUsersCollection
            .updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },

    async updateUserConfirmationCode(code: string, email: string, date: Date): Promise<boolean> {
        const result = await dbUsersCollection
            .updateOne({'accountData.email': email},
                {$set: {'emailConfirmation.confirmationCode': code, 'emailConfirmation.expirationDate': date}})
        return result.modifiedCount === 1
    },

    async insertInvalidRefreshJWT(refreshJWT: string): Promise<void> {
        await dbTokensCollection.insertOne({invalidRefreshToken: refreshJWT})
    },

    async getInvalidRefreshJWT(refreshJWT: string): Promise<RefreshTokenDBType | null> {
        return dbTokensCollection.findOne({invalidRefreshToken: refreshJWT})
    },

    async deleteAllTokens(): Promise<void> {
        await dbTokensCollection.deleteMany({})
    }
}