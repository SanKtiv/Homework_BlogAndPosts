import {InputBlogModelType, BlogType} from "../../../src/types/blogs-types";

export const countOfWord = (count: number): string => {
    let words: string = 'o'
    while (count > 0) {
        words += 'o'
        count--
    }
    return words
}

type SendBody_TRUETYPE = {
    name: string
    description: string
    websiteUrl: string
}

type Blog3TYPE = {
    name_TRUE: string
    description_TRUE: string
    websiteUrl_TRUE: string
    sendBody_TRUE: SendBody_TRUETYPE
}

export const blog3: Blog3TYPE = {
    name_TRUE: "blog_name",
    description_TRUE: "Qwerty12",
    websiteUrl_TRUE: "https://someurl.com",
    sendBody_TRUE: {
        name: this.name_TRUE,
        description: this.description_TRUE,
        websiteUrl: this.websiteUrl_TRUE
    }
}


// export const blog = {
//
//     body: {
//         name_TRUE: "blog_name",
//         description_TRUE: "Qwerty12",
//         websiteUrl_TRUE: "https://someurl.com",
//         name_FALSE_LENGTH: countOfWord(31),
//         name_FALSE_NUM: 1234567,
//         description_FALSE_LENGTH: countOfWord(101),
//         description_FALSE_NUM: 1234567,
//         websiteUrl_FALSE_NUM: 1234567
//     },
//
//     sendBody_TRUE: {
//             name: "blog_name",
//             description: "Qwerty12",
//             websiteUrl: "https://someurl.com"
//         },
//
//     // sendBody_TRUE: {
//     //     name: this.blog.name_TRUE,
//     //     description: this.blog.description_TRUE,
//     //     websiteUrl: this.blog.websiteUrl_TRUE
//     // },
//
//     expectBlog_TRUE: {
//         id: expect.any(String),
//         name: this.body.name_TRUE,
//         description: this.body.description_TRUE,
//         websiteUrl: this.body.websiteUrl_TRUE,
//         createdAt: expect.any(String),
//         isMembership: expect.any(Boolean)
//     },
//
//     sendBody_FALSE_NAME_LENGTH: {
//         ...this.sendBody_TRUE,
//         name: this.body.name_FALSE_LENGTH
//     },
//
//     sendBody_FALSE_NAME_NUM: {
//         ...this.sendBody_TRUE,
//         name: this.body.name_FALSE_NUM
//     },
//
//     sendBody_FALSE_DESCRIPTION_LENGTH: {
//         ...this.sendBody_TRUE,
//         description: this.body.description_FALSE_LENGTH
//     },
//
//     sendBody_FALSE_DESCRIPTION_NUM: {
//         ...this.sendBody_TRUE,
//         description: this.body.description_FALSE_NUM
//     },
//
//     sendBody_FALSE_WEBSITEURL_NUM: {
//         ...this.sendBody_TRUE,
//         websiteUrl: this.body.websiteUrl_FALSE_NUM
//     },
// }

const blog1 = {
    name_TRUE: "blog_name",
    description_TRUE: "Qwerty12",
    websiteUrl_TRUE: "https://someurl.com",
    name_FALSE_LENGTH: countOfWord(31),
    name_FALSE_NUM: 1234567,
    description_FALSE_LENGTH: countOfWord(101),
    description_FALSE_NUM: 1234567,
    websiteUrl_FALSE_NUM: 1234567
}

export const blogSendBody_TRUE = {
    name: blog1.name_TRUE,
    description: blog1.description_TRUE,
    websiteUrl: blog1.websiteUrl_TRUE
}

export const expectBlog_TRUE = {
    id: expect.any(String),
    name: blog1.name_TRUE,
    description: blog1.description_TRUE,
    websiteUrl: blog1.websiteUrl_TRUE,
    createdAt: expect.any(String),
    isMembership: expect.any(Boolean)
}

export const manyBlogSendBody_TRUE = (n: number) => {
    const arr = []
    while (n > 0) {
        arr.push({...blogSendBody_TRUE, name: blog1.name_TRUE + `${11 - n}`})
        n--
    }
    return arr
}

export const expectManyBlog_TRUE = (n: number, sortBy: string) => {
    const arr = []
    while (n > 0) {
        arr.push(
            {
                ...expectBlog_TRUE,
                name: blog1.name_TRUE + `${11 - n}`,
                createdAt: sortBy
            })
        n--
    }
    return arr
}

export const viewModelBlogsDefaultPaging_TRUE = (n: number, items: BlogType[]) => {
    const fun = (a: any, b: any) => Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
    //const fun = (a: any, b: any) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
    const itemsSort = items.sort(fun)
    console.log('#2', itemsSort)
    return {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 10,
        items: itemsSort
    }
}