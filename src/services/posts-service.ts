import {
    ViewPostModelType,
    PostType,
    ExtendedLikesInfoType,
    TransactBodyType,
    InputPostModelType, PostBodyWithoutBlogIdType
} from "../types/posts-types";
import {postsRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {postHandlers} from "../routers/posts/post-handler";

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
                                userLikeStatus: string) {

        const userLikesInfo = {
            userStatus: dataBody.likeStatus,
            addedAt: new Date().toISOString(),
            userId: dataBody.userId,
            login: dataBody.login
        }

        if (dataBody.likeStatus === 'None') {

            if (userLikeStatus === 'Like') likesInfo.likesCount--
            if (userLikeStatus === 'Dislike') likesInfo.dislikesCount--

            await postsRepository
                .updatePostRemoveUserLikeStatus(dataBody.id, dataBody.userId, likesInfo)
            return
        }

        if (dataBody.likeStatus === 'Like' && userLikeStatus === 'Dislike') {
            likesInfo.likesCount++
            likesInfo.dislikesCount--
        }

        if (dataBody.likeStatus === 'Dislike' && userLikeStatus === 'Like') {
            likesInfo.dislikesCount++
            likesInfo.likesCount--
        }

        await postsRepository
            .updatePostChangeLikesInfo(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
        return
    }

}

export const postsService = new PostService()