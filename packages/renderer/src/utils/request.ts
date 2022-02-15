import axios from 'axios'

const backend = axios.create({
  baseURL: 'http://phoenix.matrix53.top/api/v1/',
})

const common = axios.create({})

export { backend, common }
