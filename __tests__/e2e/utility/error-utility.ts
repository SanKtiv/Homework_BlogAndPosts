export const expectError = (field: string) => {
    const arr = []
    arr.push({
        message: expect.any(String),
        field: field
    })
    return arr
}

