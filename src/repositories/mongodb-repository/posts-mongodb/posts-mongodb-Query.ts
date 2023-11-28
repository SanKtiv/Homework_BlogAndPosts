import {dbCommentsCollection, dbPostsCollection} from "../db";
import {postsService} from "../../../services/posts-service";
import {ObjectId} from "mongodb";
import {PostDBType, ViewPostsPagingType} from "../../../types/posts-types";
import {commentService} from "../../../services/commets-service";

export const postsRepositoryQuery = {

    async getPostsWithPaging(query: any): Promise<ViewPostsPagingType> {

        const totalPosts = await dbPostsCollection.countDocuments()

        const postsOutputFromDb = await dbPostsCollection
            .find()
            .sort({createdAt: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return postsService.postsOutputQuery(totalPosts, postsOutputFromDb, query)
    },
    
    async findPostByPostId(postId: string): Promise<PostDBType | null> {

        return dbPostsCollection.findOne({_id: new ObjectId(postId)})
    },

    async getCommentsByPostId(postId: string, query: any) {

        const totalCommentsByPostId = await dbCommentsCollection.countDocuments({postId: postId})

        const commentsByPostId = await dbCommentsCollection
            .find({postId: postId})
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return  commentService
            .paginatorCommentViewModel(totalCommentsByPostId, commentsByPostId, query)
    }
}