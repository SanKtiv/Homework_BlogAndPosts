import {routePaths} from "../../../src/setting";
import {getRequest} from './test-request';

type CommentInputType = {
    content: string
}

export const commentAction = {

    createComment: async (token: string, bodyComment: CommentInputType, postId: string | null) =>

        getRequest()
            .post(`${routePaths.posts}/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            //.auth(token, {type: 'bearer'})
            .send(bodyComment),

    async getCommentById(id: string) {
        await getRequest()
            .get(`${routePaths.comments}/${id}`)
    },

    expectGetCommentById: async (id: string, statusCode: number, comment?: any) =>
        getRequest()
            .get(`${routePaths.comments}/${id}`)
            .expect(statusCode, comment),

    async expectGetCommentById_(id: string, statusCode: number, comment?: any) {
        const commentById = await getRequest()
            .get(`${routePaths.comments}/${id}`)
            //.expect(statusCode, comment) не работает
        //const commentById = await this.getCommentById(id)
        await expect(commentById.body).toEqual(comment)
        await expect(commentById.statusCode).toBe(statusCode)
    },

    async expectDeleteCommentById(token: string, id: string, statusCode: number) {

        await getRequest()
            .delete(`${routePaths.comments}/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(statusCode)
        //await expect(dellComment.statusCode).toBe(statusCode) тоже работает
    },
}