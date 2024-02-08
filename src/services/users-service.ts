import {InputUserPagingType, ViewUsersPagingType, ViewUserModelType, UserDBType} from "../types/users-types";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {usersRepositoryReadOnly} from "../repositories/mongodb-repository/users-mongodb/users-query-mongodb";

export const userService = {

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

    async getUserByUserId(userId: string) {
        return usersRepositoryReadOnly.getUserByUserId(userId)
    },

    async deleteUserById(id: string): Promise<boolean> {
        return usersRepository.deleteUserById(id)
    },
}