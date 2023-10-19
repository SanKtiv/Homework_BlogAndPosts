import {Request, Response, Router} from 'express';
import {blogsRepository} from "../repositories/repository";
import {body, param, validationResult, ResultFactory} from 'express-validator'
import {ErrorType} from '../types/types'

export const appRouter = Router ({})

appRouter.get( '/blogs', (req: Request, res: Response) => {
    res.status(200).send(blogsRepository.getAllBlogs())
})

appRouter.get( '/blogs/:id', (req: Request, res: Response) => {
    const blogs = blogsRepository.getBlogById(req.params.id)
    blogs ? res.status(200).send(blogs) : res.sendStatus(404)

})
const validBodyName1 = body('name').isLength({min: 1, max: 15})
const validBodyName2 = body('name').isString()
appRouter.post( '/blogs', (req: Request, res: Response) => {
    // const myValidationResult: ResultFactory<string> = validationResult.withDefaults({
    //     formatter: error => error.location as string
    // })
    const errorMes = validationResult(req)
    if (errorMes.isEmpty()) {
        return res.status(200).send({errorsMessages: errorMes})
    }

    res.status(400).send({errorsMessages: errorMes})
})

///////////////////////////////////////////////
// videosRouter.delete('/testing/all-data', (req: Request, res: Response) => {
//     videosRepository.deleteAllVideo()
//     res.sendStatus(204)
// })
//
// videosRouter.delete('/videos/:videoId', (req: Request, res: Response) => {
//     if (!/^\d+$/.test(req.params.videoId)) {
//         res.sendStatus(404)
//         return
//     }
//     const status = videosRepository.deleteVideoId(req.params.videoId)
//     res.sendStatus(status)
// })
//
// videosRouter.get('/videos', (req: Request, res: Response) => {
//     // const videos = videosRepository.getVideo()
//     // res.status(200).send(videos)
// })
//
// videosRouter.get('/videos/:videoId', (req: Request, res: Response) => {
//     if (!/^\d+$/.test(req.params.videoId)) {
//         res.sendStatus(404)
//         return
//     }
//     const videos = videosRepository.getVideoId(req.params.videoId)
//     if (videos) {
//         res.status(200).send(videos)
//     } else {
//         res.sendStatus(404)
//     }
// })
// type ErrorType = { message: string, field: string }
// videosRouter.post('/videos', (req: Request, res: Response) => {
//     const err: { errorsMessages: ErrorType[] } = {
//         errorsMessages: []
//     }
//     const title = req.body.title
//     if (typeof title !== 'string' || !title.trim() || title.length > 40) {
//         err.errorsMessages.push(error('title'))
//     }
//     const author = req.body.author
//     if (typeof author !== 'string' || !author.trim() || author.length > 20) {
//         err.errorsMessages.push(error('author'))
//     }
//     const availableResolutions = req.body.availableResolutions
//     if (resolutionsFalse(availableResolutions)) {
//         err.errorsMessages.push(error('availableResolutions'))
//     }
//     if (err.errorsMessages.length) {
//         res.status(400).send(err)
//         return
//     }
//     const videos = videosRepository.createVideo(title, author, availableResolutions)
//     res.status(201).send(videos)
// })
//
// videosRouter.put('/videos/:videoId', (req: Request, res: Response) => {
//     const err: { errorsMessages: ErrorType[] } = {
//         errorsMessages: []
//     }
//     const videoId = req.params.videoId
//     if (!/^\d+$/.test(videoId)) {
//         err.errorsMessages.push(error('id'))
//     }
//     const title = req.body.title
//     if (typeof title !== 'string' || !title.trim() || title.length > 40) {
//         err.errorsMessages.push(error('title'))
//     }
//     const author = req.body.author
//     if (typeof author !== 'string' || !author.trim() || author.length > 20) {
//         err.errorsMessages.push(error('author'))
//     }
//     const availableResolutions = req.body.availableResolutions
//     if (resolutionsFalse(availableResolutions)) {
//         err.errorsMessages.push(error('availableResolutions'))
//     }
//     const canBeDownloaded = req.body.canBeDownloaded
//     if (typeof canBeDownloaded !== "boolean") {
//         err.errorsMessages.push(error('canBeDownloaded'))
//     }
//     const minAgeRestriction = req.body.minAgeRestriction
//     if ( minAgeRestriction > 18 || minAgeRestriction < 1 || typeof minAgeRestriction === 'string') {
//         err.errorsMessages.push(error('minAgeRestriction'))
//     }
//     const publicationDate = req.body.publicationDate
//     if (typeof publicationDate !== 'string' || !publicationDate.trim()) {
//         err.errorsMessages.push(error('publicationDate'))
//     }
//     if (err.errorsMessages.length) {
//         res.status(400).send(err)
//         return;
//     }
//     const status = videosRepository.updateVideo(req.params.videoId, req.body)
//     res.sendStatus(status)
//
// })