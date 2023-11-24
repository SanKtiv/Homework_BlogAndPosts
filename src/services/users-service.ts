import {WithId} from "mongodb";
import {IdUserType, User_Type, UserDbType, UserQueryType, UsersOutputType, UserViewModelType} from "../types/types-users";

export const userService = {

    addIdToUser(user: WithId<User_Type>): UserViewModelType {

        return {
            id: user._id.toString(),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    },

    usersFormOutput(totalUsers: number,
                    usersSearch: WithId<User_Type>[],
                    query: UserQueryType): UsersOutputType {

        return {
            pagesCount: Math.ceil(totalUsers / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalUsers,
            items: usersSearch.map(userDb => this.addIdToUser(userDb))
        }
    },
}