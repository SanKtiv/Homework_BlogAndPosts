export const regexp = new RegExp('\^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

export const idNumber = () => Date.now().toString()

export let dateNow = () => new Date

export const defaultQuery = {
    pageNumber: '1',
    pageSize: '10',
    sortBy: 'createdAt',
    sortDirection: 'desc'
}

export const defaultUsersQuery = {
    pageNumber: '1',
    pageSize: '10',
    sortBy: 'createdAt',
    sortDirection: 'desc'
}