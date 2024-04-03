import {PasswordRecoveryType, UserDBType, UserType} from "../../../types/users-types";
import {UsersModel} from "../db";
import {ObjectId} from "mongodb";

export class UsersRepository {

    async insertUserToDB(user: UserType): Promise<UserDBType> {

        const userDB = await UsersModel.create(user)

        return userDB as UserDBType
    }

    async deleteUserById(id: string): Promise<boolean> {

        const resultDelete = await UsersModel.deleteOne({_id: new ObjectId(id)})

        return resultDelete.deletedCount === 1
    }

    async deleteAllUsers(): Promise<void> {

        await UsersModel.deleteMany({})
    }

    async updateUserExpirationDate(id: ObjectId): Promise<boolean> {

        const resultUpdate = await UsersModel
            .updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}})

        return resultUpdate.modifiedCount === 1
    }

    async updateUserConfirmationCode(code: string, email: string, date: Date): Promise<boolean> {

        const resultUpdate = await UsersModel
            .updateOne({'accountData.email': email},
                {$set: {'emailConfirmation.confirmationCode': code, 'emailConfirmation.expirationDate': date}})

        return resultUpdate.modifiedCount === 1
    }

    async addRecoveryCode(email: string, passwordRecovery: PasswordRecoveryType) {

        const resultUpdate = await UsersModel
            .updateOne({'accountData.email': email},
                {$set: {'passwordRecovery': passwordRecovery}})

        return resultUpdate.modifiedCount === 1
    }

    async resetPasswordHash(email: string) {

        const resultUpdate = await UsersModel
            .updateOne({'accountData.email': email},
                {$set: {'accountData.passwordHash': email}})

        return resultUpdate.modifiedCount === 1
    }

    async insertNewPasswordHash(recoveryCode: string, passwordHsh: string) {

        const resultUpdate = await UsersModel
            .updateOne({'passwordRecovery.recoveryCode': recoveryCode},
                {$set: {'accountData.passwordHash': passwordHsh}})

        return resultUpdate.modifiedCount === 1
    }
}