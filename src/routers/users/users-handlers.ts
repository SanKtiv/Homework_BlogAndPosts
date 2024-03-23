import {InputUserPagingType, UserDBType, ViewUserModelType, ViewUsersPagingType} from "../../types/users-types";
import {usersQueryRepository} from "../../repositories/mongodb-repository/users-mongodb/users-query-mongodb";

export class UsersHandler {

    async createUserRequest(userId: string) {

        const user = await usersQueryRepository.getUserByUserId(userId)

        if (!user) return null

        return {
            email: user.accountData.email,
            login: user.accountData.login,
            userId: user._id.toString()
        }
    }



    createUserViewModel(user: UserDBType): ViewUserModelType {

        return {
            id: user._id.toString(),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    }

    createUsersPagingViewModel(totalUsers: number,
                               usersSearch: UserDBType[],
                               query: InputUserPagingType): ViewUsersPagingType {

        return {
            pagesCount: Math.ceil(totalUsers / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalUsers,
            items: usersSearch.map(userDb => this.createUserViewModel(userDb))
        }
    }
}

export const usersHandler = new UsersHandler()

export const userHandlers = {

    async createUserRequest(userId: string) {

        const user = await usersQueryRepository.getUserByUserId(userId)

        if (!user) return null

        return {
            email: user.accountData.email,
            login: user.accountData.login,
            userId: user._id.toString()
        }
    },

    createViewUserModel(user: UserDBType): ViewUserModelType {

        return {
            id: user._id.toString(),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    },

    usersFormOutput(totalUsers: number,
                    usersSearch: UserDBType[],
                    query: InputUserPagingType): ViewUsersPagingType {

        return {
            pagesCount: Math.ceil(totalUsers / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalUsers,
            items: usersSearch.map(userDb => this.createViewUserModel(userDb))
        }
    },
}