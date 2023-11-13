import {IdUserType, InputUserType, UserDbType, UserQueryType, UsersOutputType} from "../types/types-users";
import {WithId} from "mongodb";
import bcrypt from 'bcrypt'
import {dateNow} from "../variables/variables";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb";

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

    async createUser(body: InputUserType): Promise<IdUserType> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.genHash(body.password, passwordSalt)

        const user: UserDbType = {
            login: body.login,
            email: body.email,
            passwordHash,
            createdAt: dateNow().toISOString()
        }

        const findUser = await usersRepository.createUser(user)

        return this.addIdToUser(findUser as WithId<UserDbType>)
    },

    async checkCredentials(loginOrEmail: string, password: string) {

        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)

        if (user) return await bcrypt.compare(password, user.passwordHash);

        return false

    },

    async genHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },
}