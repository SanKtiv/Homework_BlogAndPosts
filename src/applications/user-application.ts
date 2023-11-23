export const userApplication = {
    async getUserInfo(email: string, login: string, userId: string) {
        return {
            email: email,
            login: login,
            userId: userId
        }
    }
}
