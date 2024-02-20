import {dbPostsCollection} from "../db";
import {ObjectId} from "mongodb";
import {PostDBType} from "../../../types/posts-types";

export const postsRepositoryQuery = {

    async getPostsTotalCount(): Promise<number> {

        return dbPostsCollection.countDocuments()
    },

    async getPostsWithPaging(query: any): Promise<PostDBType[]> {

        return dbPostsCollection
            .find()
            .sort({createdAt: query.sortDirection, 'userLikesInfo.addedAt': -1})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()
    },

    async getPostById(id: string): Promise<PostDBType | null> {

        try {return dbPostsCollection.findOne({_id: new ObjectId(id)})}

        catch (error) {return null}
    },

    async getLikesInfoFromPostByPostId(id: string): Promise<PostDBType | null> {

        try {
            return dbPostsCollection
                .findOne({_id: new ObjectId(id)},
            {projection: {extendedLikesInfo: 1}})}

        catch (error) {return null}
    },

    async getPostWithUserStatusByPostId(postId: string, userId: string): Promise<PostDBType | null> {

        try {
            return dbPostsCollection.findOne({
                    _id: new ObjectId(postId),
                    'userLikesInfo.userId': userId
                },
                {
                    projection: {
                        'userLikesInfo.$': 1
                    }
                })
        }
        catch (error) {return null}
    },

    async getPostWithLikeStatusInfoByPostId(postId: string, userId: string): Promise<PostDBType | null> {

        try {
            return dbPostsCollection
                .findOne({_id: new ObjectId(postId)}, {sort: {'userLikesInfo.addedAt': -1}})
                //.sort({'userLikesInfo.addedAt': -1})
        }
        catch (error) {return null}
    },
}