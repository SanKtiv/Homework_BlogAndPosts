import {body} from "express-validator";
import {blogsRepository} from "../repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";
import {blogsRepositoryQuery} from "../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";

const validTitle = body('title', 'title length is incorrect')
    .isString()
    .trim()
    .isLength({min: 1, max: 30})

const validShortDescription = body('shortDescription', 'shortDescription length is incorrect')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})

const validContent = body('content', 'content length is incorrect')
    .isString()
    .trim()
    .isLength({min: 1, max: 1000})

const validBlogIdBody = body('blogId')
    .isString().withMessage('Blog is not string')
    .trim()
    .custom(async id => {
        const blogDB = await blogsRepositoryQuery.getBlogById(id)

        if (!blogDB) {
            throw new Error('Blog is not exist')
        }
    })

export const validPost = [validTitle, validShortDescription, validContent]

export const validPostBlogId = [...validPost, validBlogIdBody]