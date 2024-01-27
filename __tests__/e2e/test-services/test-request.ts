import request from 'supertest'
import {app} from '../../../src/setting'

export const getRequest = () => request(app)