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

    async getPostsWithPagingLikes(query: any): Promise<any> {

        return dbPostsCollection
            .aggregate([
                {$sort: {createdAt: query.sortDirection === 'desc' ? -1 : 1}},
                {$skip: (+query.pageNumber - 1) * +query.pageSize},
                {$limit: +query.pageSize},
                {
                    $project: {
                        id: 1,
                        title: 1,
                        shortDescription: 1,
                        content: 1,
                        blogId: 1,
                        blogName: 1,
                        createdAt: 1,
                        extendedLikesInfo: 1,
                        userLikesInfo: {$slice: ["$userLikesInfo", -3]}
                    }
                }
            ])
            .toArray()
    },

    async getPostById(id: string): Promise<PostDBType | null> {

        try {return dbPostsCollection.findOne({_id: new ObjectId(id)})}

        catch (error) {return null}
    },

    async getUsersStatusesByUserId(userId: string): Promise<PostDBType[] | null> {

        try {
            return dbPostsCollection
                .find({ 'userLikesInfo.userId': userId },
                { projection: { 'userLikesInfo.userStatus.$': 1 } })
                .toArray()
        }
        catch (error) {return null}
    },

    async getPostWithLikesByPostID(postId: string): Promise<any | null> {

        try {
            return dbPostsCollection
                .aggregate([
                    {$match: {_id: new ObjectId(postId)}},
                    {$sort: {'userLikesInfo.addedAt': 1}},
                    {
                        $project: {
                            id: 1,
                            title: 1,
                            shortDescription: 1,
                            content: 1,
                            blogId: 1,
                            blogName: 1,
                            createdAt: 1,
                            extendedLikesInfo: 1,
                            userLikesInfo: {$slice: ["$userLikesInfo", -3]}
                        }
                    }
                ])
                .next()
        } catch (error) {
            return null
        }
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

    async getUserStatusByPostIdAndUserId(postId: string, userId: string): Promise<PostDBType | null> {

        try {
            return dbPostsCollection.findOne({
                    _id: new ObjectId(postId),
                    'userLikesInfo.userId': userId
                }, { projection: { _id: 0, 'userLikesInfo.userStatus.$': 1 } })
        }
        catch (error) {return null}
    },

    async getPostUserLikeStatus(postId: string, userId: string): Promise<PostDBType | null> {

        try {
            return dbPostsCollection.findOne(
            { _id: new ObjectId(postId) },
                {projection: { _id: 0, userLikesInfo: { $elemMatch: { userId: userId } } } }
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
                    {$limit: 3},
                    {$group: {_id: '$_id', userLikesInfo: { $push: '$userLikesInfo'}}},
                    {$project: {_id: 0, userLikesInfo: 1}}
                ])
                .next()
        }
        catch (error) {return null}
    },
}