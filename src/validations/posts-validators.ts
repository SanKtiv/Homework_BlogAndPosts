import {body, ValidationChain} from "express-validator";
import {
    BlogsRepositoryQuery,
    blogsRepositoryQuery
} from "../repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";

class PostsValidation {

    private blogsRepositoryQuery: BlogsRepositoryQuery
    public title: ValidationChain
    public content: ValidationChain
    public blogId: ValidationChain
    public shortDescription: ValidationChain

    constructor() {

        this.blogsRepositoryQuery = new BlogsRepositoryQuery()

        this.title = body('title', 'title length is incorrect')
            .isString()
            .trim()
            .isLength({min: 1, max: 30})

        this.content = body('content', 'content length is incorrect')
            .isString()
            .trim()
            .isLength({min: 1, max: 1000})

        this.shortDescription = body('shortDescription', 'shortDescription length is incorrect')
            .isString()
            .trim()
            .isLength({min: 1, max: 100})

        this.blogId = body('blogId')
            .isString().withMessage('Blog is not string')
            .trim()
            .custom(this.customFunc.bind(this))
    }

    async customFunc(id: string) {

        const blogDB = await this.blogsRepositoryQuery.getBlogById(id)

        if (!blogDB) throw new Error('Blog is not exist')
    }
}

export const postsValidation = new PostsValidation()

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