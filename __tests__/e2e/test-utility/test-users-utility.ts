import {
    InputUserAuthModelType,
    InputUserModelType,
    ViewUserModelType,
    ViewUsersPagingType
} from "../../../src/types/users-types";

export const user = {

    login_TRUE: 'Qwerty10',

    login_FALSE: 'Qwerty13',

    email_TRUE: 'qwerty@yandex.com',

    password_TRUE: 'Qwerty10',

    password_FALSE: 'Qwerty123',

    paging1: {
        pageNumber: 1,
        pageSize: 5,
        sortBy: 'createdAt',
        sortDirection: 'desc',
    },

    paging2: {
        pageNumber: 1,
        pageSize: 5,
        sortBy: 'createdAt',
        sortDirection: 'asc',
        searchLoginTerm: 'y101',
        searchEmailTerm: '3qw'
    },

    pagingAll: {
        pageNumber: 1,
        pageSize: 100,
        sortBy: 'createdAt',
        sortDirection: 'desc',
    },

    query(paging: any): string {
        return `?` + Object.keys(paging).map(e => e + `=${paging[e]}`).join('&')
    },

    sendBody_TRUE(): InputUserModelType {
        return {
            login: this.login_TRUE,
            password: this.password_TRUE,
            email: this.email_TRUE
        }
    },

    sendBodyAuth_TRUE(): InputUserAuthModelType {
        return {
            loginOrEmail: this.login_TRUE,
            password: this.password_TRUE
        }
    },

    sendBodyAuth_FALSE(): InputUserAuthModelType {
        return {
            loginOrEmail: this.login_TRUE,
            password: this.password_FALSE
        }
    },

    sendManyBody(usersCount: number): InputUserModelType[] {
        const arr = []
        for (let i = 1; i <= usersCount; i++) {
            arr.push({
                login: this.login_TRUE + `${i}`,
                password: this.password_TRUE + `${i}`,
                email: `${i}` + this.email_TRUE
            })
        }
        return arr
    },

    expectPaging(allUsers: ViewUserModelType[], paging: any): ViewUsersPagingType {

        let filter = null
        const regexpLog = new RegExp(paging.searchLoginTerm, 'i')
        const regexpMail = new RegExp(paging.searchEmailTerm, 'i')

        if (paging.searchLoginTerm && paging.searchEmailTerm) {
            filter = (el: any) => regexpLog.test(el.login) || regexpMail.test(el.email)
        } else {
            if (paging.searchLoginTerm) filter = (el: any) => regexpLog.test(el.login)
            if (paging.searchEmailTerm) filter = (el: any) => regexpMail.test(el.email)
        }

        if (filter) {
            allUsers = allUsers.filter(filter)
        }

        const f = paging.sortBy === 'createdAt'
            ? (sortBy: any) => Number(new Date(sortBy.createdAt))
            : (sortBy: any) => sortBy[paging.sortBy]

        const funcSort = paging.sortDirection === 'desc'
            ? (a: any, b: any) => f(b) - f(a)
            : (a: any, b: any) => f(a) - f(b)

        allUsers.sort(funcSort)

        return {
            pagesCount: Math.ceil(allUsers.length / paging.pageSize),
            page: paging.pageNumber,
            pageSize: paging.pageSize,
            totalCount: allUsers.length,
            items: allUsers.slice((paging.pageNumber - 1) * paging.pageSize, paging.pageSize * paging.pageNumber)
        }
    },

    expectBody_TRUE(): ViewUserModelType {
        return {
            id: expect.any(String),
            login: this.login_TRUE,
            email: this.email_TRUE,
            createdAt: expect.any(String)
        }
    },
}