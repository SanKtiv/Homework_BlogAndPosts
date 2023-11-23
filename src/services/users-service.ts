import {WithId} from "mongodb";
import {IdUserType, UserDbType, UserQueryType, UsersOutputType} from "../types/types-users";

export const userService = {

    addIdToUser(user: WithId<UserDbType>): IdUserType {

        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },

    usersFormOutput(totalUsers: number,
                    usersSearch: WithId<UserDbType>[],
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