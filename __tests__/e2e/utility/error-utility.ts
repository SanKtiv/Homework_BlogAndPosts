export const expectError = (field: string) => {
    const arr = []
    arr.push({
        message: expect.any(String),
        field: field
    })
    return arr
}

export const expectErrors = (body: any) => {
    const arr = []
    for (const key in body) {
        if (typeof body[key] === "number") {
            arr.push({
                message: expect.any(String),
                field: key
            })
        }
    }
    return {errorsMessages: arr}
}