import {User_Type, UserDBType, UsersOutputType} from "../../types/types-users";
import {dbUsersCollection} from "./db";
import {ObjectId, WithId} from "mongodb";
import {userService} from "../../services/users-service";


export const usersRepositoryReadOnly = {

    async userSearch(query: any, login?: RegExp, email?: RegExp): Promise<WithId<User_Type>[]> {

        const sortBy = `accountData.${query.sortBy}`
        const filter = []

        if (login) filter.push({'accountData.login': login})
        if (email) filter.push({'accountData.email': email})

        if (login && email) {

            return dbUsersCollection
                .find({$or: filter})
                .sort({[sortBy]: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
                .toArray()

        }
        return dbUsersCollection
            .find(filter[0])
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()
    },

    async getAllUsers(query: any): Promise<UsersOutputType> {

        const searchLoginTermRegexp = new RegExp(query.searchLoginTerm, 'i')
        const searchEmailTermRegexp = new RegExp(query.searchEmailTerm, 'i')
        let totalUsers: number
        const filter = []

        if (query.searchLoginTerm) filter.push({'accountData.login': searchLoginTermRegexp})
        if (query.searchEmailTerm) filter.push({'accountData.email': searchEmailTermRegexp})

        if (query.searchLoginTerm && query.searchEmailTerm) {

            totalUsers = await dbUsersCollection
                .countDocuments({$or: filter})
        } else if (query.searchLoginTerm) {

            totalUsers = await dbUsersCollection
                .countDocuments({'accountData.login': searchLoginTermRegexp})

        } else if (query.searchEmailTerm) {

            totalUsers = await dbUsersCollection
                .countDocuments({'accountData.email': searchEmailTermRegexp})
        } else {

            totalUsers = await dbUsersCollection.countDocuments({})
        }

        const usersSearch = await this.userSearch(query, searchLoginTermRegexp, searchEmailTermRegexp)
        return userService.usersFormOutput(totalUsers, usersSearch, query)
    },

    async getUserById(userId: string): Promise<WithId<User_Type> | null> {
        return  dbUsersCollection.findOne({_id: new ObjectId(userId)})
    },

    async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
        return dbUsersCollection
            .findOne({$or: [{'accountData.login': loginOrEmail}, {'accountData.email': loginOrEmail}]})
    },

    async getUserByConfirmationCode(code: string): Promise<UserDBType | null> {
        return dbUsersCollection.findOne({'emailConfirmation.confirmationCode': code})
    }
}