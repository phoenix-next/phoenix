import axios from 'axios'

const request = axios.create({
  baseURL: 'http://phoenix.matrix53.top/',
})

export { request }
