import {InputUserModelType, ViewUserModelType, ViewUsersPagingType} from "../../../src/types/users-types";

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
        searchLoginTerm: null,
        searchEmailTerm: null
    },

    paging2: {
        pageNumber: 2,
        pageSize: 5,
        sortBy: 'createdAt',
        sortDirection: 'asc',
        searchLoginTerm: 'y12',
        searchEmailTerm: 'om'
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

    sendManyBody(usersCount: number): InputUserModelType[] {
        const arr = []
        for (let i = 1; i <= usersCount; i++) {
            arr.push({
                login: this.login_TRUE + `${i}`,
                password: this.password_TRUE + `${i}`,
                email: this.email_TRUE
            })
        }
        return arr
    },

    expectPaging(allUsers: ViewUserModelType[], paging: any): ViewUsersPagingType {

        const regexpLog = paging.searchLoginTerm
            ? new RegExp(paging.searchLoginTerm, 'i')
            : paging.searchLoginTerm

        const regexpEmail = paging.searchEmailTerm
            ? new RegExp(paging.searchEmailTerm, 'i')
            : paging.searchEmailTerm



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
            items: allUsers.slice(0, paging.pageSize)
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