 export const comment = {
    id_FALSE: '1234567890',
    content_TRUE: 'content-content-content',
}

export const commentSendBody_TRUE = {
    content: comment.content_TRUE
}

export const commentCorrect = {
    id: expect.any(String),
    content: comment.content_TRUE,
    commentatorInfo: {
        userId: expect.any(String),
        userLogin: expect.any(String)
    },
    createdAt: expect.any(String),
    likesInfo: {
        likesCount: expect.any(Number),
        dislikesCount: expect.any(Number),
        myStatus: expect.any(String),
    },
}