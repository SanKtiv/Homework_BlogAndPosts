import {dbPostsCollection} from "./db";
import {PostsOutputQueryType} from "../../types/typesForQuery";
import {postsService} from "../../services/posts-service";

export const postsRepositoryQuery = {

    async getPostsWithPaging(query: any): Promise<PostsOutputQueryType> {

        const totalPosts = await dbPostsCollection.countDocuments()

        const postsOutputFromDb = await dbPostsCollection
            .find()
            .sort({createdAt: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return postsService.postsOutputQuery(totalPosts, postsOutputFromDb, query)
    },
}