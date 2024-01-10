export const user = {

    login_TRUE: 'Qwerty10',

    login_FALSE: 'Qwerty13',

    email_TRUE: 'qwerty@yandex.com',

    password_TRUE: 'Qwerty10',

    password_FALSE: 'Qwerty123',

    paging1: {
        pageNumber: 1,
        pageSize: 5,
        sortBy:  'createdAt',
        sortDirection: 'desc',
        searchLoginTerm: null,
        searchEmailTerm: null
    },

    paging2: {
        pageNumber: 2,
        pageSize: 5,
        sortBy:  'createdAt',
        sortDirection: 'asc',
        searchLoginTerm: 'y12',
        searchEmailTerm: 'om'
    },

    query(paging: any) {
        return `?` + Object.keys(paging).map(e => e + `=${paging[e]}`).join('&')
    },

    sendBody_TRUE() {
        return {
            login: this.login_TRUE,
            password: this.password_TRUE,
            email: this.email_TRUE
        }
    },

    sendManyBody(usersCount: number) {
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

    expectPaging(usersCount: number) {

    },

    expectBody_TRUE() {
        return {
            id: expect.any(String),
            login: this.login_TRUE,
            email: this.email_TRUE,
            createdAt: expect.any(String)
        }
    },
}