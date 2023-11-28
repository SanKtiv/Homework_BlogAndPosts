import {InputUserPagingType, ViewUsersPagingType, ViewUserModelType, UserDBType} from "../types/users-types";

export const userService = {

    addIdToUser(user: UserDBType): ViewUserModelType {

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
            items: usersSearch.map(userDb => this.addIdToUser(userDb))
        }
    },
}