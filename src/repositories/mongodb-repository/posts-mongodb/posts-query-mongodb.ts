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

    async getLikesInfoFromPostByPostId(id: string): Promise<any | null> {

        try {
            return dbPostsCollection
                .findOne({_id: new ObjectId(id)},
            {projection: {_id: 0, extendedLikesInfo: 1}})
        }
        catch (error) {return null}
    },

    async getPostUserLikeStatusByPostId(postId: string, userId: string): Promise<PostDBType | null> {

        try {
            return dbPostsCollection.findOne({
                    _id: new ObjectId(postId),
                    'userLikesInfo.userId': userId
                },
                {
                    projection: {
                        _id: 0,
                        'userLikesInfo.$': 1
                    }
                })
        }
        catch (error) {return null}
    },

    async getPostUserLikeStatus(postId: string, userId: string): Promise<PostDBType | null> {

        try {
            return dbPostsCollection.findOne(
            { _id: new ObjectId(postId) },
                {projection: { "userLikesInfo.$[elem].userStatus": 1 },
                    arrayFilters:   [{ "elem.userId": userId }]   }
            // {projection: { userLikesInfo: { $elemMatch: { userId: userId } } } }
            )
        }
        catch (error) {return null}
    },

    async getUserLikesInfoSortByAddedAt(postId: string, userId: string): Promise<any | null> {

        try {
            return dbPostsCollection
                .aggregate([
                    {$match: {_id: new ObjectId(postId)}},
                    {$unwind: '$userLikesInfo'},
                    {$sort: {'userLikesInfo.addedAt': -1}},
                    {$limit: 2},
                    {$group: {_id: '$_id', userLikesInfo: { $push: '$userLikesInfo'}}},
                    {$project: {_id: 0, userLikesInfo: 1}}
                ])
                .next()
        }
        catch (error) {return null}
    },
}