import {IdUserType, InputUserType, UserDbType} from "../types/types-users";
import {WithId} from "mongodb";
import bcrypt from 'bcrypt'
import {dateNow} from "../variables/variables";
import {usersRepository} from "../repositories/mongodb-repository/users-mongodb";
import {userService} from "./users-service";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'

export const authService = {

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
        return userService.addIdToUser(findUser as WithId<UserDbType>)
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<UserDbType> | null> {

        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return user
        const result = await bcrypt.compare(password, user.passwordHash)
        if (result) return user
        return null
    },

    async genHash(password: string, salt: string) {

        return await bcrypt.hash(password, salt)
    },


}