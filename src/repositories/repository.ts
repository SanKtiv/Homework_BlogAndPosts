type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: null | number,
    createdAt: string,
    publicationDate: string,
    availableResolutions: Array<string> | null
}

export const error = (mess: string) => {
     return  {message: `Wrong ${mess}`, field: mess}
}


let dateNow = new Date
let dateNowAndDay = new Date
dateNowAndDay.setDate(dateNowAndDay.getDate() + 1)


const defaultVideo: VideoType = {
    id: 1,
    title: 'Great Video',
    author: 'Name',
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: dateNow.toISOString(),
    publicationDate: dateNow.toISOString(),
    availableResolutions: ['P1080']
}

const resolutionsTrue: Array<string> = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ]

export const resolutionsFalse = (resolutions: Array<string> | null) => {
    if (resolutions !== null && resolutions.length) {
        for (const r of resolutions) {
            if (resolutionsTrue.indexOf(r) === -1) {
                return true
            }
        }
        return false
    } else if (resolutions === null) {
        return false
    } else {
        return true
    }
    //return resolutions !== null && resolutionsTrue.indexOf(resolutions[0]) === -1 && resolutions.length > 1? true : false;
}

const listOfVideos: VideoType[] = [defaultVideo] // Database of Videos

export const videosRepository = {

    deleteAllVideo():void {
        listOfVideos.splice(0, listOfVideos.length)
    },

    deleteVideoId(videoId: string): number {
        const foundVideo = listOfVideos.find(v => v.id === +videoId)
        if (foundVideo) {
            const indexOfDeleteVideo = listOfVideos.indexOf(foundVideo)
            listOfVideos.splice(indexOfDeleteVideo, 1)
            return 204
        } else {
            return 404
        }
    },

    getVideo(): VideoType[] {
        return listOfVideos
    },

    getVideoId(videoId: string): VideoType | undefined {
        return listOfVideos.find(v => v.id === +videoId)
    },

    createVideo(title: string, author: string, availableResolutions: Array<string> | null): VideoType {
        const newVideo: VideoType = {
            id: Date.now(),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: dateNow.toISOString(),
            publicationDate: dateNowAndDay.toISOString(),
            availableResolutions
        }
        listOfVideos.push(newVideo)
        return newVideo
    },

    updateVideo(videoId: string, dataUpdate: any): number {
        const foundVideo = listOfVideos.find(v => v.id === +videoId)
        if (foundVideo) {
            listOfVideos.forEach(v => {
                if (v.id === +videoId) {
                    v.title = dataUpdate.title
                    v.author = dataUpdate.author
                    v.availableResolutions = dataUpdate.availableResolutions
                    v.canBeDownloaded = dataUpdate.canBeDownloaded
                    v.minAgeRestriction = dataUpdate.minAgeRestriction
                    v.publicationDate = dataUpdate.publicationDate
                }
            })
            return 204
        } else {
            return 404
        }
    }
}