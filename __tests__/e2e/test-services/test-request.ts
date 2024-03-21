import request from 'supertest'
import {app} from '../../../src/setting'

export const getRequest = function () {
    return request(app)
}