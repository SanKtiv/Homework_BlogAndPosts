import {
    InputPostsPagingType,
    PostDBType, UserLikesInfoType,
    ViewPostModelType,
    ViewPostsPagingType
} from "../../types/posts-types";

export const postHandlers = {

    createPostPagingViewModel(
        totalPosts: number,
        postsItems: any[],
        query: InputPostsPagingType,
        myStatus: string): ViewPostsPagingType {

        return {
            pagesCount: Math.ceil(totalPosts / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalPosts,
            items: postsItems.map(postFromDb => this.createPostViewModel(postFromDb, myStatus))
        }
    },

    createPostViewModel(postFromDB: any, myStatus: string): ViewPostModelType {

        const {
            _id,
            extendedLikesInfo,
            userLikesInfo,
            ...postViewModelWithoutId
        } = postFromDB

        const newestLikes = userLikesInfo.map((el: any) => {
            const {userStatus, ...newestLikes} = el
            return newestLikes
        })

        const newExtendedLikesInfo = {
            ...extendedLikesInfo,
            myStatus: myStatus,
            newestLikes: newestLikes
        }

        return  {
            id: postFromDB._id.toString(),
            ...postViewModelWithoutId,
            extendedLikesInfo: newExtendedLikesInfo
        }
    },
}