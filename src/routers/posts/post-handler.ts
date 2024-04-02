import {
    InputPostsPagingType,
    PostDBType,
    ViewPostModelType,
    ViewPostsPagingType
} from "../../types/posts-types";

export class PostsHandler {

    createPostViewModel(postFromDB: PostDBType, userId?: string): ViewPostModelType {

        const {userLikesInfo, extendedLikesInfo} = postFromDB

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
            title: postFromDB.title,
            shortDescription: postFromDB.shortDescription,
            content: postFromDB.content,
            blogId: postFromDB.blogId,
            blogName: postFromDB.blogName,
            createdAt: postFromDB.createdAt,
            extendedLikesInfo: {
                likesCount: extendedLikesInfo.likesCount,
                dislikesCount: extendedLikesInfo.dislikesCount,
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