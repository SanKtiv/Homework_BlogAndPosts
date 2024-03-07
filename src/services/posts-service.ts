import {WithId} from "mongodb";
import {ViewPostModelType, PostType, PostDBType, ExtendedLikesInfoType, TransactBodyType} from "../types/posts-types";
import {InputPostsPagingType, ViewPostsPagingType} from "../types/posts-types";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";

export const postsService = {

    createExtendedLikesInfoForPost(bodyForCreate: any) {


    },

    async addLikesInfoInPost(dataBody: TransactBodyType, likesInfo: ExtendedLikesInfoType) {

        const userLikesInfo = {
            userStatus: dataBody.likeStatus,
            addedAt: new Date().toISOString(),
            userId: dataBody.userId,
            login: dataBody.login
        }

        if (dataBody.likeStatus === 'Like') likesInfo.likesCount++
        if (dataBody.likeStatus === 'Dislike') likesInfo.dislikesCount++

        await postsRepository.updatePostAddLikesInfo(dataBody.id, likesInfo, userLikesInfo)
    },

    async changeLikesInfoInPost(dataBody: TransactBodyType,
                                likesInfo: ExtendedLikesInfoType,
                                userLikeStatus: any) {

        const userLikesInfo = {
            userStatus: dataBody.likeStatus,
            addedAt: new Date().toISOString(),
            userId: dataBody.userId,
            login: dataBody.login
        }

        //if (dataBody.likeStatus === userLikeStatus) return

        // if (dataBody.likeStatus === 'Like' && userLikeStatus === 'None') {
        //     likesInfo.likesCount++
        // }

        if (dataBody.likeStatus === 'Like' && userLikeStatus === 'Dislike') {
            likesInfo.likesCount++
            likesInfo.dislikesCount--
            await postsRepository
                .updatePostChangeLikesInfo(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
        }

        // if (dataBody.likeStatus === 'Dislike' && userLikeStatus === 'None') {
        //     likesInfo.dislikesCount++
        // }

        if (dataBody.likeStatus === 'Dislike' && userLikeStatus === 'Like') {
            likesInfo.dislikesCount++
            likesInfo.likesCount--
            await postsRepository
                .updatePostChangeLikesInfo(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
        }

        if (dataBody.likeStatus === 'None' && userLikeStatus === 'Like') {
            likesInfo.likesCount--
            await postsRepository
                .updatePostRemoveUserLikeStatus(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
        }

        if (dataBody.likeStatus === 'None' && userLikeStatus === 'Dislike') {
            likesInfo.dislikesCount--
            await postsRepository
                .updatePostRemoveUserLikeStatus(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
        }
    },

    postDbInToBlog(postOutDb: PostDBType): ViewPostModelType {

        const {_id, extendedLikesInfo, userLikesInfo, ...newPostFromDB} = postOutDb



        return  {
            id: postOutDb._id.toString(),
            ...newPostFromDB,
            extendedLikesInfo: {
                ...extendedLikesInfo,
                myStatus: 'None',
                newestLikes: userLikesInfo
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