import {
    ViewPostModelType,
    PostType,
    PostDBType,
    ExtendedLikesInfoType,
    TransactBodyType,
    InputPostModelType, PostBodyWithoutBlogIdType
} from "../types/posts-types";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {postHandlers} from "../routers/posts/post-handler";
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";
import {dateNow} from "../variables/variables";
import {dbPostsCollection} from "../repositories/mongodb-repository/db";

class PostService {

    async createPost(body: InputPostModelType, blogName: string): Promise<ViewPostModelType> {

        const newPost = new PostType(
            body.title,
            body.shortDescription,
            body.content,
            body.blogId,
            blogName,
            new Date().toISOString(),
            {likesCount: 0, dislikesCount: 0},
            []
        )

        const postDB = await postsRepository.insertPostToDB(newPost)

        return postHandlers.createPostViewModelNew(postDB)
    }

    async createPostByBlogId(blogId: string, body: PostBodyWithoutBlogIdType, blogName: string): Promise<ViewPostModelType> {

        const newPost = new PostType(
            body.title,
            body.shortDescription,
            body.content,
            blogId,
            blogName,
            new Date().toISOString(),
            {likesCount: 0, dislikesCount: 0},
            []
        )

        const postDB = await postsRepository.insertPostToDB(newPost)

        return postHandlers.createPostViewModelNew(postDB)
    }

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
    }

    async changeLikesInfoInPost(dataBody: TransactBodyType,
                                likesInfo: ExtendedLikesInfoType,
                                userLikeStatus: any) {

        const userLikesInfo = {
            userStatus: dataBody.likeStatus,
            addedAt: new Date().toISOString(),
            userId: dataBody.userId,
            login: dataBody.login
        }

        if (dataBody.likeStatus === 'Like' && userLikeStatus === 'Dislike') {
            likesInfo.likesCount++
            likesInfo.dislikesCount--
            await postsRepository
                .updatePostChangeLikesInfo(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
        }

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
    }

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
    }

}

export const postsService = new PostService()

// export const postsService = {
//
//     async createPost(body: InputPostModelType, blogName: string): Promise<ViewPostModelType> {
//
//         const newPost = new PostType(
//             body.title,
//             body.shortDescription,
//             body.content,
//             body.blogId,
//             blogName,
//             new Date().toISOString(),
//             {likesCount: 0, dislikesCount: 0},
//             []
//         )
//
//         const postDB = await postsRepository.insertPostToDB(newPost)
//
//         return postHandlers.createPostViewModelNew(postDB)
//     },
//
//     async addLikesInfoInPost(dataBody: TransactBodyType, likesInfo: ExtendedLikesInfoType) {
//
//         const userLikesInfo = {
//             userStatus: dataBody.likeStatus,
//             addedAt: new Date().toISOString(),
//             userId: dataBody.userId,
//             login: dataBody.login
//         }
//
//         if (dataBody.likeStatus === 'Like') likesInfo.likesCount++
//         if (dataBody.likeStatus === 'Dislike') likesInfo.dislikesCount++
//
//         await postsRepository.updatePostAddLikesInfo(dataBody.id, likesInfo, userLikesInfo)
//     },
//
//     async changeLikesInfoInPost(dataBody: TransactBodyType,
//                                 likesInfo: ExtendedLikesInfoType,
//                                 userLikeStatus: any) {
//
//         const userLikesInfo = {
//             userStatus: dataBody.likeStatus,
//             addedAt: new Date().toISOString(),
//             userId: dataBody.userId,
//             login: dataBody.login
//         }
//
//         if (dataBody.likeStatus === 'Like' && userLikeStatus === 'Dislike') {
//             likesInfo.likesCount++
//             likesInfo.dislikesCount--
//             await postsRepository
//                 .updatePostChangeLikesInfo(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
//         }
//
//         if (dataBody.likeStatus === 'Dislike' && userLikeStatus === 'Like') {
//             likesInfo.dislikesCount++
//             likesInfo.likesCount--
//             await postsRepository
//                 .updatePostChangeLikesInfo(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
//         }
//
//         if (dataBody.likeStatus === 'None' && userLikeStatus === 'Like') {
//             likesInfo.likesCount--
//             await postsRepository
//                 .updatePostRemoveUserLikeStatus(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
//         }
//
//         if (dataBody.likeStatus === 'None' && userLikeStatus === 'Dislike') {
//             likesInfo.dislikesCount--
//             await postsRepository
//                 .updatePostRemoveUserLikeStatus(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
//         }
//     },
//
//     postDbInToBlog(postOutDb: PostDBType): ViewPostModelType {
//
//         const {_id, extendedLikesInfo, userLikesInfo, ...newPostFromDB} = postOutDb
//
//         return  {
//             id: postOutDb._id.toString(),
//             ...newPostFromDB,
//             extendedLikesInfo: {
//                 ...extendedLikesInfo,
//                 myStatus: 'None',
//                 newestLikes: userLikesInfo
//             }
//         }
//     },
// }