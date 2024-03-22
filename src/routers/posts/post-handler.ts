import {
    InputPostsPagingType,
    PostDBType,
    ViewPostModelType,
    ViewPostsPagingType
} from "../../types/posts-types";

export class PostsHandler {

    createPostViewModel(postFromDB: PostDBType, userId?: string): ViewPostModelType {

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
    }

    createPostPagingViewModel(totalPosts: number,
                              postsFromDB: PostDBType[],
                              query: InputPostsPagingType,
                              userId?: string): ViewPostsPagingType {

        const items = userId ?
            postsFromDB.map(postDB => this.createPostViewModel(postDB, userId)) :
            postsFromDB.map(postDB => this.createPostViewModel(postDB))

        return {
            pagesCount: Math.ceil(totalPosts / +query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: totalPosts,
            items: items
        }
    }
}

export const postsHandler = new PostsHandler()
// export const postHandlers = {
//
//     createPostViewModelNew(postFromDB: PostDBType, userId?: string): ViewPostModelType {
//
//         const {_id, userLikesInfo, extendedLikesInfo, ...postViewModelWithoutId} = postFromDB
//
//         let myStatus = 'None'
//
//         if (userId) {
//
//             const findUserStatus = userLikesInfo.find(el => el.userId === userId)
//
//             myStatus = findUserStatus ? findUserStatus.userStatus : 'None'
//         }
//
//         const newestLikes = userLikesInfo
//             .filter(el => el.userStatus === 'Like')
//             .sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
//             .slice(0, 3)
//             .map(({userStatus, ...newestLikes}) => newestLikes)
//
//         return  {
//             id: postFromDB._id.toString(),
//             ...postViewModelWithoutId,
//             extendedLikesInfo: {
//                 ...extendedLikesInfo,
//                 myStatus: myStatus,
//                 newestLikes: newestLikes
//             }
//         }
//     },
//
//     createPostPagingViewModelNew(totalPosts: number,
//                                  postsFromDB: PostDBType[],
//                                  query: InputPostsPagingType,
//                                  userId?: string): ViewPostsPagingType {
//
//         const items = userId ?
//             postsFromDB.map(postDB => this.createPostViewModelNew(postDB, userId)) :
//             postsFromDB.map(postDB => this.createPostViewModelNew(postDB))
//
//         return {
//             pagesCount: Math.ceil(totalPosts / +query.pageSize),
//             page: +query.pageNumber,
//             pageSize: +query.pageSize,
//             totalCount: totalPosts,
//             items: items
//         }
//     },
// }