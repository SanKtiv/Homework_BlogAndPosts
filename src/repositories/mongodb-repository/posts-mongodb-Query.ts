import {dbPostsCollection} from "./db";
import {PostsOutputQueryType} from "../../types/typesForQuery";
import {postsService} from "../../services/posts-service";
import {ObjectId, WithId} from "mongodb";
import {PostType} from "../../types/typesForMongoDB";

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
    
    async findPostByPostId(postId: string): Promise<WithId<PostType> | null> {

        return  dbPostsCollection.findOne({_id: new ObjectId(postId)})
    }
}