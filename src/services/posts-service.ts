import {WithId} from "mongodb";
import {ViewPostModelType, PostType, PostDBType, ExtendedLikesInfoType} from "../types/posts-types";
import {InputPostsPagingType, ViewPostsPagingType} from "../types/posts-types";

export const postsService = {

    async addLikesInfoInPost(id: string, likeStatus: string, userId: string, login: string, likesInfo: ExtendedLikesInfoType) {

        const newLikesInfo = likesInfo

        const userLikesInfo = {
            userStatus: likeStatus,
            addedAt: new Date().toISOString(),
            userId: userId,
            login: login
        }


    },

    postDbInToBlog(postOutDb: PostDBType): ViewPostModelType {

        const {_id, extendedLikesInfo, userLikesInfo, ...newPostFromDB} = postOutDb



        return  {
            id: postOutDb._id.toString(),
            ...newPostFromDB,
            extendedLikesInfo: {
                ...extendedLikesInfo,
                myStatus: userLikesInfo[0].userStatus,
                newestLikes: [{
                    addedAt: 'string',
                    userId: 'string',
                    login: 'string'
                }]
            }
        }
    },

    postsOutputQuery(
        totalBlogs: number,
        blogsItems: WithId<PostType>[],
        query: InputPostsPagingType): ViewPostsPagingType {

        return {
            pagesCount: Math.ceil(totalBlogs / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalBlogs,
            items: blogsItems.map(blogOutDb => this.postDbInToBlog(blogOutDb))
        }
    },
}