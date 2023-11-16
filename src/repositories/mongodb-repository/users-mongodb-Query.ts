import {UserDbType, UsersOutputType, UserType} from "../../types/types-users";
import {dbUsersCollection} from "./db";
import {ObjectId, WithId} from "mongodb";
import {userService} from "../../services/users-service";


export const usersRepositoryReadOnly = {

    async userSearch(query: any, login?: RegExp, email?: RegExp): Promise<WithId<UserDbType>[]> {

        // const filter: any = {}
        //
        // if (login) filter.login = {$regex: login}
        // if (email) filter.email = {$regex: email}
        //
        // return dbUsersCollection
        //     .find(filter)
        //     .sort({[query.sortBy]: query.sortDirection})
        //     .skip((+query.pageNumber - 1) * +query.pageSize)
        //     .limit(+query.pageSize)
        //     .toArray()

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

    async getAllUsers(query: any): Promise<UsersOutputType> {

        const searchLoginTermRegexp = new RegExp(query.searchLoginTerm, 'i')
        const searchEmailTermRegexp = new RegExp(query.searchEmailTerm, 'i')
        let totalUsers: number

        if (query.searchLoginTerm && query.searchEmailTerm) {

            totalUsers = await dbUsersCollection
                .countDocuments({$or: [
                    {login: {$regex: searchLoginTermRegexp}},
                            {email: {$regex: searchEmailTermRegexp}}
                            ]})
        } else if (query.searchLoginTerm) {

            totalUsers = await dbUsersCollection
                .countDocuments({login: {$regex: searchLoginTermRegexp}})

        } else if (query.searchEmailTerm) {

            totalUsers = await dbUsersCollection
                .countDocuments({email: {$regex: searchEmailTermRegexp}})
        } else {

            totalUsers = await dbUsersCollection.countDocuments({})
        }

        const usersSearch = await this.userSearch(query, searchLoginTermRegexp, searchEmailTermRegexp)
        return userService.usersFormOutput(totalUsers, usersSearch, query)
    },

    async getUserById(userId: string): Promise<UserType | null> {

        const user = await dbUsersCollection.findOne({_id: new ObjectId(userId)})
        if (user) return {...user, _id: user._id.toString()}
        return null
    }
}