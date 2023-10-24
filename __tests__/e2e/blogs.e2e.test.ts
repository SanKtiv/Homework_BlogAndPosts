import request from 'supertest'
import {app} from '../../src/setting'

const getRequest = () => {
    return request(app)
}

describe('/blogs', () => {
    beforeAll(async () => {
        await getRequest().delete('/testing/all-data')
    })
    it('should HTTP status equal 200, and return []', async () => {
        await getRequest()
            .get('/blogs')
            .expect(200, [])
    })
    afterAll(done => {
        done()
    })
})
