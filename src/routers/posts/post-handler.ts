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
        usersStatuses?: any[]): ViewPostsPagingType {

        const items = postsItems.map(postDB => {

            let myStatus = 'None'

            if (!usersStatuses) return this.createPostViewModel(postDB, myStatus)

            const result = usersStatuses
                .find(el => el._id.toString() === postDB._id.toString())

            // console.log('result =', result)

            if (result) myStatus = result.userLikesInfo[0].userStatus

            return this.createPostViewModel(postDB, myStatus)
        })

        return {
            pagesCount: Math.ceil(totalPosts / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalPosts,
            items: items
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