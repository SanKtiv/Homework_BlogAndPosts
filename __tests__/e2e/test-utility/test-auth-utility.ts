export type AuthType = {
    basic_TRUE: BasicType
    basic_FALSE: BasicType
}

export type BasicType = {
    type: string
    password: string
}

export const auth: AuthType = {
    basic_TRUE: {
        type: 'Authorization',
        password: 'Basic YWRtaW46cXdlcnR5'
    },
    basic_FALSE: {
        type: 'Authorization',
        password: 'Basic XXXXXXXXXXXXXX'
    }
}