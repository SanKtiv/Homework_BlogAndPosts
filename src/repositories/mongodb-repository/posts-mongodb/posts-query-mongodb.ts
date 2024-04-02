import {dbPostsCollection, PostsModel} from "../db";
import {ObjectId} from "mongodb";
import {PostDBType} from "../../../types/posts-types";

export class PostsQueryRepository {

    async getPostsTotalCount(): Promise<number> {

        return PostsModel.countDocuments()
    }

    async getCountPostsByBlogId(blogId: string): Promise<number> {

        return PostsModel.countDocuments({blogId: blogId})
    }

    async getPostsWithPaging(query: any): Promise<PostDBType[]> {

        return PostsModel
            .find()
            .sort({createdAt: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            //.toArray()
    }

    async getPostById(id: string): Promise<PostDBType | null> {

        try {
            return await PostsModel.findOne({_id: new ObjectId(id)})
        }

        catch (error) {return null}
    }

    async getLikesInfoByPostId(id: string): Promise<PostDBType | null> {

        try {
            //await required before return
            return await PostsModel
                .findOne({_id: new ObjectId(id)},
                    {projection: {_id: 0, extendedLikesInfo: 1}})
                .lean()
        }
        catch (error) {return null}
    }

    async getPostUserLikeStatusByPostId(postId: string, userId: string): Promise<PostDBType | null> {

        try {
            return await PostsModel
                .findOne({
                    _id: new ObjectId(postId),
                    'userLikesInfo.userId': userId
                }, {
                    projection: {
                        _id: 0,
                        'userLikesInfo.$': 1
                    }
                })
                .lean()
        }
        catch (error) {return null}
    }
}