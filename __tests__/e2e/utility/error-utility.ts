export const expectError = (field: string) => {
    const arr = []
    arr.push({
        message: expect.any(String),
        field: field
    })
    return arr
}

export const expectErrors = (sendBody: any) => {
    const arr = []
    for (const key in sendBody) {
        if (typeof sendBody[key] === "number") {
            arr.push({
                message: expect.any(String),
                field: key
            })
        }
    }
    return {errorsMessages: arr}
}