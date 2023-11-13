import {UserDbType} from "../../types/types-users";
import {dbUsersCollection} from "./db";
import {WithId} from "mongodb";
import {userService} from "../../services/users-service";


export const usersRepositoryReadOnly = {

    async userSearch(query: any, login?: RegExp, email?: RegExp): Promise<WithId<UserDbType>[]> {

        if (login && email) {

            return dbUsersCollection
                .find({$or: [{login: {$regex: login}}, {email: {$regex: email}}]})
                .sort({[query.sortBy]: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
                .toArray()

        }else if (login) {

            return dbUsersCollection
                .find({login: {$regex: login}})
                .sort({[query.sortBy]: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
                .toArray()

        } else if (email) {
            return dbUsersCollection
                .find({email: {$regex: email}})
                .sort({[query.sortBy]: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
                .toArray()
        }
        return dbUsersCollection
            .find({})
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()
    },

    async getAllUsers(query: any) {

        const searchLoginTermRegexp = new RegExp(query.searchLoginTerm, 'i')
        const searchEmailTermRegexp = new RegExp(query.searchEmailTerm, 'i')
        let totalUsers: number

        if (query.searchLoginTerm && query.searchEmailTerm) {

            totalUsers = await dbUsersCollection
                .countDocuments({$or: [
                    {login: {$regex: searchLoginTermRegexp}},
                            {email: {$regex: searchEmailTermRegexp}}
                            ]})
        }else if (query.searchLoginTerm) {

            totalUsers = await dbUsersCollection
                .countDocuments({login: {$regex: searchLoginTermRegexp}})

        }else if (query.searchEmailTerm) {

            totalUsers = await dbUsersCollection
                .countDocuments({email: {$regex: searchEmailTermRegexp}})
        }else {

            totalUsers = await dbUsersCollection.countDocuments({})
        }

        const usersSearch = await this.userSearch(query, searchLoginTermRegexp, searchEmailTermRegexp)

        return userService.usersFormOutput(totalUsers, usersSearch, query)
    }
}