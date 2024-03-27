import {
    PostType,
    ExtendedLikesInfoType,
    TransactBodyType,
    InputPostModelType, PostBodyWithoutBlogIdType, PostDBType
} from "../types/posts-types";
import {PostsRepository} from "../repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";

export class PostsService {

    constructor(protected postsRepository: PostsRepository) {}

    async createPost(body: InputPostModelType,
                     blogName: string): Promise<PostDBType> {

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

        return this.postsRepository.insertPostToDB(newPost)
    }

    async createPostByBlogId(blogId: string,
                             body: PostBodyWithoutBlogIdType,
                             blogName: string): Promise<PostDBType> {

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

        return this.postsRepository.insertPostToDB(newPost)
    }

    async updatePost(id: string, body: InputPostModelType): Promise<Boolean> {

        return this.postsRepository.updatePost(id, body)
    }

    async addLikesInfoInPost(dataBody: TransactBodyType,
                             likesInfo: ExtendedLikesInfoType) {

        const userLikesInfo = {
            userStatus: dataBody.likeStatus,
            addedAt: new Date().toISOString(),
            userId: dataBody.userId,
            login: dataBody.login
        }

        if (dataBody.likeStatus === 'Like') likesInfo.likesCount++
        if (dataBody.likeStatus === 'Dislike') likesInfo.dislikesCount++

        await this.postsRepository.updatePostAddLikesInfo(dataBody.id, likesInfo, userLikesInfo)
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

            await this.postsRepository
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

        await this.postsRepository
            .updatePostChangeLikesInfo(dataBody.id, dataBody.userId, likesInfo, userLikesInfo)
        return
    }

    async deletePostById(id: string): Promise<Boolean> {

        return this.postsRepository.deletePostById(id)
    }
}