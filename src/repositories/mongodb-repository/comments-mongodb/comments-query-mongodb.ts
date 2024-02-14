import {dbCommentsCollection} from "../db";

export const commentsRepositoryQuery = {

    async getTotalCommentsByPostId(postId: string): Promise<number> {
        return dbCommentsCollection.countDocuments({postId: postId})
    },

    async getCommentsByPostId(postId: string, query: any) {

        return dbCommentsCollection
            .find({postId: postId})
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()
    }
}