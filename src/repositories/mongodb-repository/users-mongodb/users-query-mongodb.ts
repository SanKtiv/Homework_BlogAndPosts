import {UserDBType} from "../../../types/users-types";
import {UsersModel} from "../db";

export class UsersQueryRepository {

    async getUsersPaging(query: any, login?: RegExp, email?: RegExp): Promise<UserDBType[]> {

        const sortBy = `accountData.${query.sortBy}`
        const filter = []

        if (login) filter.push({'accountData.login': login})
        if (email) filter.push({'accountData.email': email})

        if (login && email) {

            return UsersModel
                .find({$or: filter})
                .sort({[sortBy]: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
                .lean()

        }
        return UsersModel
            .find(filter[0])
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .lean()
    }

    // async getAllUsers(query: any): Promise<ViewUsersPagingType> {
    //
    //     const searchLoginTermRegexp = new RegExp(query.searchLoginTerm, 'i')
    //     const searchEmailTermRegexp = new RegExp(query.searchEmailTerm, 'i')
    //     let totalUsers: number
    //     const filter = []
    //
    //     if (query.searchLoginTerm) filter.push({'accountData.login': searchLoginTermRegexp})
    //     if (query.searchEmailTerm) filter.push({'accountData.email': searchEmailTermRegexp})
    //
    //     if (query.searchLoginTerm && query.searchEmailTerm) {
    //
    //         totalUsers = await dbUsersCollection.countDocuments({$or: filter})
    //     }
    //     else {
    //
    //         totalUsers = await dbUsersCollection.countDocuments(filter[0])
    //     }
    //
    //     const usersSearch = await this.getUsersPaging(query, searchLoginTermRegexp, searchEmailTermRegexp)
    //
    //     return userHandlers.usersFormOutput(totalUsers, usersSearch, query)
    // }

    async getCountUsers(filter: {}[]) {

        const newFilter = filter.length > 1 ? {$or: filter}: filter[0]

        return UsersModel.countDocuments(newFilter)
    }

    async getUserByUserId(userId: string): Promise<UserDBType | null> {

        return UsersModel.findById(userId).lean()
    }

    async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {

        return UsersModel
            .findOne({
                $or: [
                    {'accountData.login': loginOrEmail},
                    {'accountData.email': loginOrEmail}
                ]
            })
            .lean()
    }

    async getUserByConfirmationCode(code: string): Promise<UserDBType | null> {

        return UsersModel
            .findOne({'emailConfirmation.confirmationCode': code})
            .lean()
    }

    async getUserByRecoveryCode(recoveryCode: string): Promise<UserDBType | null> {

        try {
            return UsersModel
                .findOne({'passwordRecovery.recoveryCode': recoveryCode})
                .lean()
        }
        catch (e) {
            throw new Error('ExpDateOfRecoveryCode is not read')
        }
    }
}

export const usersQueryRepository = new UsersQueryRepository()