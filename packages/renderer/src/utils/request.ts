import axios from 'axios'

const request = axios.create({
  baseURL: 'http://phoenix.matrix53.top/api/v1/',
})

export { request }
