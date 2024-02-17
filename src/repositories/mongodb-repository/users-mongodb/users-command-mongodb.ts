import {PasswordRecoveryType, UserDBType, UserType} from "../../../types/users-types";
import {dbUsersCollection} from "../db";
import {ObjectId} from "mongodb";

export const usersRepository = {

    async insertUserToDB(user: UserType): Promise<UserDBType> {
        await dbUsersCollection.insertOne(user)
        return user as UserDBType
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

    async addRecoveryCode(email: string, passwordRecovery: PasswordRecoveryType) {
        const result = await dbUsersCollection
            .updateOne({'accountData.email': email},
                {$set: {'passwordRecovery': passwordRecovery}})

        return result.modifiedCount === 1
    },

    async resetPasswordHash(email: string) {
        const result = await dbUsersCollection
            .updateOne({'accountData.email': email},
                {$set: {'accountData.passwordHash': email}})

        return result.modifiedCount === 1
    },

    async insertNewPasswordHash(recoveryCode: string, passwordHsh: string) {
        const result = await dbUsersCollection
            .updateOne({'passwordRecovery.recoveryCode': recoveryCode},
                {$set: {'accountData.passwordHash': passwordHsh}})

        return result.modifiedCount === 1
    }
}