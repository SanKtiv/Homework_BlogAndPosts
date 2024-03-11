import {
    InputPostsPagingType,
    PostDBType, UserLikesInfoType,
    ViewPostModelType,
    ViewPostsPagingType
} from "../../types/posts-types";
import {JwtPayload} from "jsonwebtoken";

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

        newestLikes
            .sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())

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

    createPostViewModelNew(postFromDB: PostDBType, userId?: string): ViewPostModelType {

        const {_id, userLikesInfo, extendedLikesInfo, ...postViewModelWithoutId} = postFromDB

        let myStatus = 'None'

        if (userId) {

            const findUserStatus = userLikesInfo.find(el => el.userId === userId)

            myStatus = findUserStatus ? findUserStatus.userStatus : 'None'
        }

        const newestLikes = userLikesInfo
            .filter(el => el.userStatus === 'Like')
            .sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
            .slice(0, 3)
            .map(({userStatus, ...newestLikes}) => newestLikes)

        return  {
            id: postFromDB._id.toString(),
            ...postViewModelWithoutId,
            extendedLikesInfo: {
                ...extendedLikesInfo,
                myStatus: myStatus,
                newestLikes: newestLikes
            }
        }
    },

    createPostPagingViewModelNew(
        totalPosts: number,
        postsFromDB: PostDBType[],
        query: InputPostsPagingType,
        userId?: string): ViewPostsPagingType {

        const items = userId ?
            postsFromDB.map(postDB => this.createPostViewModelNew(postDB, userId)) :
            postsFromDB.map(postDB => this.createPostViewModelNew(postDB))

        return {
            pagesCount: Math.ceil(totalPosts / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalPosts,
            items: items
        }
    },
}