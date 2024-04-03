import mongoose from "mongoose";
import {CommentDBType} from "../../types/comments-types";
import {BlogType} from "../../types/blogs-types";
import {PostType} from "../../types/posts-types";
import {UserType} from "../../types/users-types";

export const BlogSchema = new mongoose.Schema<BlogType>({
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean,
}, {versionKey: false})

export const PostsSchema = new mongoose.Schema<PostType>({
    title: {
        type: String,
        require: true
    },
    shortDescription: String,
    content: String,
    blogId: {
        type: String,
        require: true
    },
    blogName: {
        type: String,
        require: true
    },
    createdAt: String,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number
    },
    userLikesInfo: [
        {
            userStatus: String,
            addedAt: String,
            userId: String,
            login: String
        }
    ]
}, {versionKey: false})

export const UsersSchema = new mongoose.Schema<UserType>({
    accountData: {
        login: {type: String, require: true},
        email: {type: String, require: true},
        createdAt: {type: String, require: true},
        passwordHash: {type: String, require: true}
    },
    emailConfirmation: {
        confirmationCode: {type: String, require: true},
        expirationDate: {type: Date, require: true},
        isConfirmed: {type: Boolean, require: true}
    },
    passwordRecovery: {
        recoveryCode: String,
        expirationDate: Date
    }
}, {versionKey: false})

export const CommentSchema = new mongoose.Schema<CommentDBType>({
    content: {type: String, require: true},
    commentatorInfo: {
        userId: {type: String, require: true},
        userLogin: {type: String, require: true},
    },
    createdAt: {type: String, require: true},
    postId: {type: String, require: true},
    likesInfo: {likesCount: Number, dislikesCount: Number,},
    usersLikeStatuses: [{userId: String, userStatus: String,}]
}, {versionKey: false})