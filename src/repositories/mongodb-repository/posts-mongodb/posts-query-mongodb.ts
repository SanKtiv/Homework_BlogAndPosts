import {dbPostsCollection} from "../db";
import {ObjectId} from "mongodb";
import {PostDBType, ViewPostModelType} from "../../../types/posts-types";
import {postsService} from "../../../services/posts-service";

export const postsRepositoryQuery = {

    async getPostsTotalCount(): Promise<number> {

        return dbPostsCollection.countDocuments()
    },

    async getPostsWithPaging(query: any): Promise<PostDBType[]> {

        return dbPostsCollection
            .find()
            .sort({createdAt: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()
    },

    async getPostById(id: string): Promise<PostDBType | null> {

        try {return dbPostsCollection.findOne({_id: new ObjectId(id)})}

        catch (error) {
            return null
        }
        //const postFromDb = await dbPostsCollection.findOne({_id: new ObjectId(id)})

        //if (postFromDb === null) return null

        //return postsService.postDbInToBlog(postFromDb)
    },


    async findPostByPostId(postId: string): Promise<PostDBType | null> {

        return dbPostsCollection.findOne({_id: new ObjectId(postId)})
    },
}