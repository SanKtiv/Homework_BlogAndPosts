import {BlogType} from "../../../src/types/blogs-types";
import {ObjectId} from "mongodb";

export const wordLength = (count: number): string => {
    let words: string = ''
    for (let i = 0; count > i; i++) {
        words += 'o'
    }
    return words
}

export const NUM: number = 1234567890

type SendBody_TRUETYPE = {
    name: string
    description: string
    websiteUrl: string
}

export const blog = {
    id: {
        FALSE_NUM: NUM,
        FALSE_STRING: NUM.toString(),
        FALSE: new ObjectId(NUM).toString()
    },

    body: {
        name_TRUE: "blog_name",
        description_TRUE: "Qwerty12",
        websiteUrl_TRUE: "https://someurl.com",
        name_FALSE_EMPTY: wordLength(0),
        name_FALSE_LENGTH: wordLength(31),
        name_FALSE_NUM: NUM,
        description_FALSE_EMPTY: wordLength(0),
        description_FALSE_LENGTH: wordLength(101),
        description_FALSE_NUM: NUM,
        websiteUrl_FALSE_NUM: NUM
    },

    pagingDefaultSettings: {
        searchNameTerm: null,
        sortBy: 'createdAt',
        sortDirection: 'desc',
        pageNumber: 1,
        pageSize: 10
    },

    pagingSettings: {
        searchNameTerm: 'e1',
        sortBy: 'createdAt',
        sortDirection: 'asc',
        pageNumber: 1,
        pageSize: 4
    },

    queryPresets(pagingSettings: any) {
        if (pagingSettings.searchNameTerm) {
            return `?searchNameTerm=${pagingSettings.searchNameTerm}`
                +`&sortBy=${pagingSettings.sortBy}`
                +`&sortDirection=${pagingSettings.sortDirection}`
                +`&pageNumber=${pagingSettings.pageNumber}`
                +`&pageSize=${pagingSettings.pageSize}`
        }
        return `?sortBy=${pagingSettings.sortBy}`
            +`&sortDirection=${pagingSettings.sortDirection}`
            +`&pageNumber=${pagingSettings.pageNumber}`
            +`&pageSize=${pagingSettings.pageSize}`
    },

    sendBody_TRUE() {
        return {
            name: this.body.name_TRUE,
            description: this.body.description_TRUE,
            websiteUrl: this.body.websiteUrl_TRUE
        }
    },

    expectBlog_TRUE() {
        return {
            id: expect.any(String),
            name: this.body.name_TRUE,
            description: this.body.description_TRUE,
            websiteUrl: this.body.websiteUrl_TRUE,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        }
    },

    sendBody_FALSE_NAME_LENGTH() {
        return {
            ...this.sendBody_TRUE(),
            name: this.body.name_FALSE_LENGTH
        }
    },

    sendBody_FALSE_NAME_NUM() {
        return {
            ...this.sendBody_TRUE(),
            name: this.body.name_FALSE_NUM
        }
    },

    sendBody_FALSE_DESCRIPTION_LENGTH() {
        return {
            ...this.sendBody_TRUE(),
            description: this.body.description_FALSE_LENGTH
        }
    },

    sendBody_FALSE_DESCRIPTION_NUM() {
        return {
            ...this.sendBody_TRUE(),
            description: this.body.description_FALSE_NUM
        }
    },

    sendBody_FALSE_WEBSITEURL_NUM() {
        return {
            ...this.sendBody_TRUE(),
            websiteUrl: this.body.websiteUrl_FALSE_NUM
        }
    },

    sendBody_FALSE_ALL() {
        return {
            name: this.body.name_FALSE_NUM,
            description: this.body.description_FALSE_NUM,
            websiteUrl: this.body.websiteUrl_FALSE_NUM
        }
    },

    manySendBody(blogsCount: number) {
      const arr = []
      for (let i = 1; i <= blogsCount; i++) {
          arr.push({...this.sendBody_TRUE(), name: this.body.name_TRUE + `${i}`})
      }
      return arr
    },

    viewModelBlogsPaging_TRUE(blogsCount: number, items: BlogType[], pagingSettings: any) {

        const f = (sort: any) => Number(new Date(sort[pagingSettings.sortBy]))
        const newItems = [...items]
        let itemsDefaultSort

        if (pagingSettings.sortDirection === 'asc' && pagingSettings.searchNameTerm === 'e1') {
            const regexp = new RegExp('e1', 'i')
            itemsDefaultSort = newItems.filter(el => regexp.test(el.name))
            itemsDefaultSort.sort((a, b) => f(a) - f(b))
            blogsCount = itemsDefaultSort.length
        } else {
            itemsDefaultSort = newItems.sort((a, b) => f(b) - f(a))
        }
        return {
            pagesCount: Math.ceil(blogsCount / pagingSettings.pageSize),
            page: pagingSettings.pageNumber,
            pageSize: pagingSettings.pageSize,
            totalCount: blogsCount,
            items: itemsDefaultSort
        }
    },
}