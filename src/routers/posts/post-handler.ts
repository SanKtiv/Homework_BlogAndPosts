import {
    InputPostsPagingType,
    PostDBType,
    ViewPostModelType,
    ViewPostsPagingType
} from "../../types/posts-types";

export const postHandlers = {

    createPostPagingViewModel(
        totalPosts: number,
        postsItems: PostDBType[],
        query: InputPostsPagingType): ViewPostsPagingType {

        return {
            pagesCount: Math.ceil(totalPosts / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalPosts,
            items: postsItems.map(postFromDb => this.createPostViewModel(postFromDb))
        }
    },

    createPostViewModel(postFromDB: PostDBType): ViewPostModelType {

        const {
            _id,
            extendedLikesInfo,
            userLikesInfo,
            ...postViewModelWithoutId
        } = postFromDB

        const newestLikes = userLikesInfo.map(el => {
            const {userStatus, ...newestLikes} = el
            return newestLikes
        })

        const newExtendedLikesInfo = {
            ...extendedLikesInfo,
            myStatus: 'None',
            newestLikes: newestLikes
        }

        return  {
            id: postFromDB._id.toString(),
            ...postViewModelWithoutId,
            extendedLikesInfo: newExtendedLikesInfo
        }
    },
}