import request from 'supertest'
import {app} from '../src/index'

const getRequest = () => {
    return request(app)
}

describe('/blogs', () => {
    beforeAll(async () => {
        await getRequest().delete('/testing/all-data')
    })
    it('should ', async () => {
        await getRequest()
            .get('/blogs')
            .expect(200, [])
    })
    afterAll(done => {
        done()
    })
})