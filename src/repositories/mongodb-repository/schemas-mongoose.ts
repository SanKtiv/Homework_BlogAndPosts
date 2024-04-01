import mongoose from "mongoose";
import {CommentDBType} from "../../types/comments-types";
import {BlogType} from "../../types/blogs-types";

export const BlogSchema = new mongoose.Schema<BlogType>({
    //id: { type: String, require: true },
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean,
    //versionKey: false
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
},{versionKey: false})